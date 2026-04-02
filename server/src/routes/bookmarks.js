import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get user's bookmarks
router.get('/', authenticate, async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        question: {
          select: {
            id: true, stem: true, category: true, subtopic: true,
            difficulty: true, bennerStage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// Toggle bookmark
router.post('/toggle', authenticate, async (req, res) => {
  try {
    const { questionId } = req.body;
    const existing = await prisma.bookmark.findUnique({
      where: { userId_questionId: { userId: req.user.id, questionId } }
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      res.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({ data: { userId: req.user.id, questionId } });
      res.json({ bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// Check if question is bookmarked
router.get('/check/:questionId', authenticate, async (req, res) => {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_questionId: { userId: req.user.id, questionId: req.params.questionId } }
    });
    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check bookmark' });
  }
});

export default router;
