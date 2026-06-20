import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { authenticate, asyncHandler, AuthRequest } from '../middleware/auth.js';
import { enhanceText, legalAssistant } from '../services/aiService.js';
import { extractTextFromFile, generateMarkdownExport, generateResearchPaperExport } from '../services/documentService.js';
import { analyzeDocument, countWords, countCharacters, estimateReadingTime } from '../utils/textAnalysis.js';
import { EnhancementModeKey } from '../utils/constants.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: { analysis: true },
    });
    res.json(documents);
  })
);

router.get(
  '/stats',
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user!.userId;
    const [totalDocs, totalWords, recentDocs, usageLogs] = await Promise.all([
      prisma.document.count({ where: { userId } }),
      prisma.document.aggregate({ where: { userId }, _sum: { wordCount: true } }),
      prisma.document.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, take: 5 }),
      prisma.usageLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 }),
    ]);

    const enhancedCount = await prisma.document.count({ where: { userId, status: 'ENHANCED' } });

    res.json({
      totalDocuments: totalDocs,
      totalWords: totalWords._sum.wordCount || 0,
      enhancedDocuments: enhancedCount,
      recentDocuments: recentDocs,
      usageByDay: usageLogs,
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: { analysis: true, versions: { orderBy: { version: 'desc' }, take: 10 } },
    });
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.json(document);
  })
);

router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const schema = z.object({
      title: z.string().min(1),
      originalText: z.string().min(1),
      enhancementMode: z.string().optional(),
      citationFormat: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const document = await prisma.document.create({
      data: {
        userId: req.user!.userId,
        title: data.title,
        originalText: data.originalText,
        wordCount: countWords(data.originalText),
        enhancementMode: (data.enhancementMode as never) || 'PROFESSIONAL_LEGAL',
        citationFormat: (data.citationFormat as never) || 'OSCOLA',
      },
    });

    res.status(201).json(document);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const { title, originalText, enhancedText, enhancementMode, citationFormat, status } = req.body;

    const document = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(originalText && { originalText, wordCount: countWords(originalText) }),
        ...(enhancedText !== undefined && { enhancedText }),
        ...(enhancementMode && { enhancementMode }),
        ...(citationFormat && { citationFormat }),
        ...(status && { status }),
      },
    });

    res.json(document);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ message: 'Document deleted' });
  })
);

router.post(
  '/:id/enhance',
  asyncHandler(async (req: AuthRequest, res) => {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const { feature, provider } = req.body;
    const text = req.body.text || document.originalText;

    const result = await enhanceText(
      text,
      document.enhancementMode as EnhancementModeKey,
      document.citationFormat,
      feature,
      provider
    );

    const versionCount = await prisma.documentVersion.count({ where: { documentId: document.id } });

    await prisma.documentVersion.create({
      data: {
        documentId: document.id,
        version: versionCount + 1,
        originalText: text,
        enhancedText: result.enhancedText,
        changeNote: feature || 'Full enhancement',
      },
    });

    const updated = await prisma.document.update({
      where: { id: document.id },
      data: { enhancedText: result.enhancedText, status: 'ENHANCED' },
    });

    await prisma.usageLog.create({
      data: {
        userId: req.user!.userId,
        action: 'ENHANCE',
        tokensUsed: result.tokensUsed,
        metadata: JSON.stringify({ documentId: document.id, provider: result.provider, feature }),
      },
    });

    res.json({ document: updated, ...result });
  })
);

router.post(
  '/:id/analyze',
  asyncHandler(async (req: AuthRequest, res) => {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const text = req.body.text || document.enhancedText || document.originalText;
    const scores = analyzeDocument(text);

    const analysis = await prisma.documentAnalysis.upsert({
      where: { documentId: document.id },
      create: { documentId: document.id, ...scores, insights: JSON.stringify(scores.insights) },
      update: { ...scores, insights: JSON.stringify(scores.insights) },
    });

    res.json(analysis);
  })
);

router.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const text = await extractTextFromFile(req.file.buffer, req.file.mimetype, req.file.originalname);
    const title = req.body.title || req.file.originalname.replace(/\.[^.]+$/, '');

    const document = await prisma.document.create({
      data: {
        userId: req.user!.userId,
        title,
        originalText: text,
        wordCount: countWords(text),
      },
    });

    res.status(201).json(document);
  })
);

router.get(
  '/:id/export',
  asyncHandler(async (req: AuthRequest, res) => {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const format = req.query.format as string || 'txt';
    const content = document.enhancedText || document.originalText;

    switch (format) {
      case 'md':
      case 'markdown':
        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename="${document.title}.md"`);
        res.send(generateMarkdownExport(document.title, content));
        break;
      case 'research':
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${document.title}-research.txt"`);
        res.send(generateResearchPaperExport(document.title, content));
        break;
      default:
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${document.title}.txt"`);
        res.send(content);
    }
  })
);

router.post(
  '/assistant',
  asyncHandler(async (req: AuthRequest, res) => {
    const { tool, input, provider } = req.body;
    if (!tool || !input) {
      res.status(400).json({ error: 'Tool and input required' });
      return;
    }

    const result = await legalAssistant(tool, input, provider);

    await prisma.usageLog.create({
      data: {
        userId: req.user!.userId,
        action: `ASSISTANT_${tool.toUpperCase()}`,
        tokensUsed: result.tokensUsed,
      },
    });

    res.json(result);
  })
);

router.get(
  '/meta/stats/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const text = req.query.text as string || '';
    res.json({
      wordCount: countWords(text),
      characterCount: countCharacters(text),
      readingTime: estimateReadingTime(text),
    });
  })
);

export default router;
