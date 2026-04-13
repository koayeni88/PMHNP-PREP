import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get questions with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, bennerStage, subtopic, difficulty, search, questionType, clinicalTopic, answerStatus, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };

    if (category) where.category = category;
    if (bennerStage) where.bennerStage = bennerStage;
    if (subtopic) where.subtopic = { contains: subtopic };
    if (difficulty) where.difficulty = difficulty;
    if (questionType) where.questionType = questionType;
    if (clinicalTopic) {
      const topics = clinicalTopic.split(',').map(t => t.trim()).filter(Boolean);
      where.clinicalTopic = topics.length > 1 ? { in: topics } : topics[0];
    }
    if (search) {
      where.OR = [
        { stem: { contains: search } },
        { subtopic: { contains: search } },
        { examTip: { contains: search } }
      ];
    }

    // Filter by answer status: answered (correct), failed (incorrect), unattempted
    if (answerStatus && ['answered', 'failed', 'unattempted'].includes(answerStatus)) {
      const userAnswers = await prisma.quizAnswer.findMany({
        where: { attempt: { userId: req.user.id } },
        select: { questionId: true, isCorrect: true },
      });

      // Build maps of question IDs by status
      const correctIds = new Set();
      const incorrectIds = new Set();
      userAnswers.forEach((a) => {
        if (a.isCorrect) {
          correctIds.add(a.questionId);
        } else {
          incorrectIds.add(a.questionId);
        }
      });

      const allAttemptedIds = [...new Set([...correctIds, ...incorrectIds])];

      if (answerStatus === 'answered') {
        where.id = { in: [...correctIds] };
      } else if (answerStatus === 'failed') {
        where.id = { in: [...incorrectIds] };
      } else if (answerStatus === 'unattempted') {
        if (allAttemptedIds.length > 0) {
          where.id = { notIn: allAttemptedIds };
        }
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, stem: true, category: true, subtopic: true,
          difficulty: true, bennerStage: true, clinicalReasoningObj: true,
          optionA: true, optionB: true, optionC: true, optionD: true,
          correctAnswer: true, rationale: true,
          explanationA: true, explanationB: true, explanationC: true, explanationD: true,
          examTip: true, questionType: true, clinicalTopic: true,
          pharmacologyFocus: true, bennerBreakdown: true
        }
      }),
      prisma.question.count({ where })
    ]);

    res.json({ questions, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get single question
router.get('/:id', authenticate, async (req, res) => {
  try {
    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Get faceted filter counts (for quiz builder cascading filters)
router.get('/meta/facets', authenticate, async (req, res) => {
  try {
    const { category, bennerStage, questionType, clinicalTopic } = req.query;

    function buildWhere(exclude) {
      const w = { isActive: true };
      if (category && exclude !== 'category') w.category = category;
      if (bennerStage && exclude !== 'bennerStage') w.bennerStage = bennerStage;
      if (questionType && exclude !== 'questionType') w.questionType = questionType;
      if (clinicalTopic && exclude !== 'clinicalTopic') {
        const topics = clinicalTopic.split(',').map(t => t.trim()).filter(Boolean);
        if (topics.length > 0) w.clinicalTopic = topics.length > 1 ? { in: topics } : topics[0];
      }
      return w;
    }

    const [total, cats, stages, types, topics] = await Promise.all([
      prisma.question.count({ where: buildWhere() }),
      prisma.question.groupBy({ by: ['category'], where: buildWhere('category'), _count: true }),
      prisma.question.groupBy({ by: ['bennerStage'], where: buildWhere('bennerStage'), _count: true }),
      prisma.question.groupBy({ by: ['questionType'], where: buildWhere('questionType'), _count: true }),
      prisma.question.groupBy({ by: ['clinicalTopic'], where: buildWhere('clinicalTopic'), _count: true })
    ]);

    res.json({
      total,
      categories: Object.fromEntries(cats.map(c => [c.category, c._count])),
      bennerStages: Object.fromEntries(stages.map(s => [s.bennerStage, s._count])),
      questionTypes: Object.fromEntries(types.map(t => [t.questionType, t._count])),
      clinicalTopics: Object.fromEntries(topics.map(t => [t.clinicalTopic, t._count]))
    });
  } catch (error) {
    console.error('Facets error:', error);
    res.status(500).json({ error: 'Failed to fetch filter counts' });
  }
});

// Get available filters
router.get('/meta/filters', authenticate, async (req, res) => {
  try {
    const [categories, stages, subtopics, difficulties, questionTypes, clinicalTopics] = await Promise.all([
      prisma.question.findMany({ distinct: ['category'], select: { category: true }, where: { isActive: true } }),
      prisma.question.findMany({ distinct: ['bennerStage'], select: { bennerStage: true }, where: { isActive: true } }),
      prisma.question.findMany({ distinct: ['subtopic'], select: { subtopic: true }, where: { isActive: true } }),
      prisma.question.findMany({ distinct: ['difficulty'], select: { difficulty: true }, where: { isActive: true } }),
      prisma.question.findMany({ distinct: ['questionType'], select: { questionType: true }, where: { isActive: true } }),
      prisma.question.findMany({ distinct: ['clinicalTopic'], select: { clinicalTopic: true }, where: { isActive: true } })
    ]);
    res.json({
      categories: categories.map(c => c.category),
      bennerStages: stages.map(s => s.bennerStage),
      subtopics: subtopics.map(s => s.subtopic),
      difficulties: difficulties.map(d => d.difficulty),
      questionTypes: questionTypes.map(q => q.questionType),
      clinicalTopics: clinicalTopics.map(c => c.clinicalTopic)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

export default router;
