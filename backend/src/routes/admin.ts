import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, requireAdmin, asyncHandler, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const [totalUsers, totalDocuments, activeSubscriptions, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.document.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { subscription: true } }),
    ]);

    const totalWords = await prisma.document.aggregate({ _sum: { wordCount: true } });
    const usageToday = await prisma.usageLog.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    });

    res.json({
      totalUsers,
      totalDocuments,
      activeSubscriptions,
      totalWords: totalWords._sum.wordCount || 0,
      usageToday,
      recentUsers,
      systemHealth: 'healthy',
    });
  })
);

router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { subscription: true, _count: { select: { documents: true } } },
      }),
      prisma.user.count(),
    ]);
    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  })
);

router.patch(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const { role, plan } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(role && { role }) },
      include: { subscription: true },
    });
    if (plan && user.subscription) {
      await prisma.subscription.update({ where: { userId: user.id }, data: { plan } });
    }
    res.json(user);
  })
);

router.get(
  '/analytics',
  asyncHandler(async (_req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageLogs = await prisma.usageLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    });

    const documentsByDay = await prisma.document.groupBy({
      by: ['createdAt'],
      _count: true,
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    res.json({ usageLogs, documentsByDay });
  })
);

router.get(
  '/prompt-templates',
  asyncHandler(async (_req, res) => {
    const templates = await prisma.promptTemplate.findMany({ orderBy: { name: 'asc' } });
    res.json(templates);
  })
);

router.post(
  '/prompt-templates',
  asyncHandler(async (req, res) => {
    const schema = z.object({
      name: z.string(),
      description: z.string().optional(),
      systemPrompt: z.string(),
      userPrompt: z.string(),
      enhancementMode: z.string(),
    });
    const data = schema.parse(req.body);
    const template = await prisma.promptTemplate.create({ data: data as never });
    res.status(201).json(template);
  })
);

router.get(
  '/audit-logs',
  asyncHandler(async (req, res) => {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    });
    res.json(logs);
  })
);

export default router;
