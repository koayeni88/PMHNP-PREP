import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [userCount, questionCount, attemptCount, activeQuestions] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.quizAttempt.count({ where: { completed: true } }),
      prisma.question.count({ where: { isActive: true } })
    ]);

    // Questions by category
    const byCategory = await prisma.question.groupBy({
      by: ['category'],
      _count: true,
      where: { isActive: true }
    });

    // Questions by Benner stage
    const byStage = await prisma.question.groupBy({
      by: ['bennerStage'],
      _count: true,
      where: { isActive: true }
    });

    // Questions by type
    const byType = await prisma.question.groupBy({
      by: ['questionType'],
      _count: true,
      where: { isActive: true }
    });

    // Questions by clinical topic
    const byClinicalTopic = await prisma.question.groupBy({
      by: ['clinicalTopic'],
      _count: true,
      where: { isActive: true, clinicalTopic: { not: '' } }
    });

    res.json({
      userCount,
      questionCount,
      activeQuestions,
      attemptCount,
      byCategory: byCategory.map(c => ({ category: c.category, count: c._count })),
      byStage: byStage.map(s => ({ stage: s.bennerStage, count: s._count })),
      byType: byType.map(t => ({ type: t.questionType, count: t._count })),
      byClinicalTopic: byClinicalTopic.map(c => ({ topic: c.clinicalTopic, count: c._count }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// CRUD Questions
router.get('/questions', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.question.count()
    ]);
    res.json({ questions, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.post('/questions', async (req, res) => {
  try {
    const { stem, optionA, optionB, optionC, optionD, correctAnswer, rationale,
      explanationA, explanationB, explanationC, explanationD, examTip,
      category, subtopic, difficulty, bennerStage, clinicalReasoningObj,
      questionType, clinicalTopic, pharmacologyFocus, bennerBreakdown } = req.body;
    if (!stem || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !rationale || !category || !subtopic || !difficulty || !bennerStage) {
      return res.status(400).json({ error: 'Missing required question fields' });
    }
    const question = await prisma.question.create({
      data: { stem, optionA, optionB, optionC, optionD, correctAnswer, rationale,
        explanationA: explanationA || '', explanationB: explanationB || '',
        explanationC: explanationC || '', explanationD: explanationD || '',
        examTip: examTip || '', category, subtopic, difficulty, bennerStage,
        clinicalReasoningObj: clinicalReasoningObj || '',
        questionType: questionType || 'standard',
        clinicalTopic: clinicalTopic || '',
        pharmacologyFocus: pharmacologyFocus || '',
        bennerBreakdown: bennerBreakdown || '' }
    });
    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

router.put('/questions/:id', async (req, res) => {
  try {
    const allowed = ['stem', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer',
      'rationale', 'explanationA', 'explanationB', 'explanationC', 'explanationD',
      'examTip', 'category', 'subtopic', 'difficulty', 'bennerStage',
      'clinicalReasoningObj', 'questionType', 'clinicalTopic', 'pharmacologyFocus',
      'bennerBreakdown', 'isActive'];
    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data
    });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    await prisma.question.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    res.json({ deactivated: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate question' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, tier: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, tier } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(role && { role }), ...(tier && { tier }) },
      select: { id: true, email: true, name: true, role: true, tier: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Most missed questions
router.get('/analytics/missed', async (req, res) => {
  try {
    const answers = await prisma.quizAnswer.groupBy({
      by: ['questionId'],
      _count: { isCorrect: true },
      _avg: { timeSpent: true }
    });

    const correctCounts = await prisma.quizAnswer.groupBy({
      by: ['questionId'],
      where: { isCorrect: true },
      _count: true
    });

    const correctMap = {};
    correctCounts.forEach(c => { correctMap[c.questionId] = c._count; });

    const stats = answers.map(a => ({
      questionId: a.questionId,
      totalAttempts: a._count.isCorrect,
      correctCount: correctMap[a.questionId] || 0,
      accuracy: Math.round(((correctMap[a.questionId] || 0) / a._count.isCorrect) * 100),
      avgTime: Math.round(a._avg.timeSpent || 0)
    }));

    stats.sort((a, b) => a.accuracy - b.accuracy);

    // Fetch question details for top 20 most missed
    const top = stats.slice(0, 20);
    const questionIds = top.map(t => t.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, stem: true, category: true, subtopic: true, bennerStage: true }
    });

    const questionMap = {};
    questions.forEach(q => { questionMap[q.id] = q; });

    res.json(top.map(t => ({ ...t, question: questionMap[t.questionId] })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch missed analytics' });
  }
});

export default router;
