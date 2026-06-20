import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { signToken, generateVerificationToken, generateResetToken, verifyToken } from '../utils/jwt.js';
import { authenticate, asyncHandler, AuthRequest } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const verificationToken = generateVerificationToken();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        verificationToken,
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: 'USER_REGISTERED', resource: 'user', details: JSON.stringify({ email: user.email }) },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified },
      message: 'Registration successful. Please verify your email.',
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email }, include: { subscription: true } });

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        subscription: user.subscription,
      },
    });
  })
);

router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { googleId, email, name, avatarUrl } = req.body;
    if (!googleId || !email) {
      res.status(400).json({ error: 'Google ID and email required' });
      return;
    }

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
      include: { subscription: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name: name || email.split('@')[0],
          avatarUrl,
          emailVerified: true,
          subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
        },
        include: { subscription: true },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatarUrl, emailVerified: true },
        include: { subscription: true },
      });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ token, user });
  })
);

router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const resetToken = generateResetToken(user.id);
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) },
      });
    }
    res.json({ message: 'If an account exists, a reset link has been sent.' });
  })
);

router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const payload = verifyToken(token) as unknown as { userId: string; type: string };
    if (payload.type !== 'reset') {
      res.status(400).json({ error: 'Invalid reset token' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ message: 'Password reset successful' });
  })
);

router.post(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      res.status(400).json({ error: 'Invalid verification token' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    res.json({ message: 'Email verified successfully' });
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { subscription: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      subscription: user.subscription,
      createdAt: user.createdAt,
    });
  })
);

export default router;
