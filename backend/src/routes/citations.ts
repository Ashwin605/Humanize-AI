import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, asyncHandler, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const citations = await prisma.citationLibrary.findMany({
      where: { userId: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(citations);
  })
);

router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const schema = z.object({
      title: z.string().min(1),
      citation: z.string().min(1),
      format: z.string().optional(),
      notes: z.string().optional(),
      tags: z.array(z.string()).optional(),
    });
    const data = schema.parse(req.body);

    const citation = await prisma.citationLibrary.create({
      data: {
        userId: req.user!.userId,
        title: data.title,
        citation: data.citation,
        format: (data.format as never) || 'OSCOLA',
        notes: data.notes,
        tags: JSON.stringify(data.tags || []),
      },
    });
    res.status(201).json(citation);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    await prisma.citationLibrary.deleteMany({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    res.json({ message: 'Citation deleted' });
  })
);

export default router;
