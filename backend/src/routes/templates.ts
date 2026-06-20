import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, asyncHandler, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const templates = await prisma.template.findMany({
      where: { OR: [{ userId: req.user!.userId }, { isPublic: true }] },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(templates);
  })
);

router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      content: z.string().min(1),
      enhancementMode: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const template = await prisma.template.create({
      data: {
        userId: req.user!.userId,
        name: data.name,
        description: data.description,
        content: data.content,
        enhancementMode: (data.enhancementMode as never) || 'PROFESSIONAL_LEGAL',
      },
    });
    res.status(201).json(template);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    await prisma.template.deleteMany({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    res.json({ message: 'Template deleted' });
  })
);

export default router;
