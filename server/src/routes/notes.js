import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get notes for a question
router.get('/question/:questionId', authenticate, async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { userId_questionId: { userId: req.user.id, questionId: req.params.questionId } }
    });
    res.json(note || { content: '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Save/update note
router.post('/', authenticate, async (req, res) => {
  try {
    const { questionId, content } = req.body;
    if (!questionId || content === undefined) {
      return res.status(400).json({ error: 'questionId and content required' });
    }
    const note = await prisma.note.upsert({
      where: { userId_questionId: { userId: req.user.id, questionId } },
      update: { content },
      create: { userId: req.user.id, questionId, content }
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Get all notes
router.get('/', authenticate, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      include: {
        question: {
          select: { id: true, stem: true, category: true, subtopic: true, bennerStage: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Delete note
router.delete('/:noteId', authenticate, async (req, res) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.noteId } });
    if (!note || note.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    await prisma.note.delete({ where: { id: req.params.noteId } });
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
