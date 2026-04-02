import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Create a quiz (custom or exam)
router.post('/create', authenticate, async (req, res) => {
  try {
    const { mode = 'practice', category, bennerStage, questionCount = 20, timeLimit, questionType, clinicalTopic } = req.body;

    const where = { isActive: true };
    if (category) where.category = category;
    if (bennerStage) where.bennerStage = bennerStage;
    if (questionType) where.questionType = questionType;
    if (clinicalTopic) {
      const topics = clinicalTopic.split(',').map(t => t.trim()).filter(Boolean);
      where.clinicalTopic = topics.length > 1 ? { in: topics } : topics[0];
    }

    // Fetch random questions
    const allQuestions = await prisma.question.findMany({ where, select: { id: true } });

    if (allQuestions.length === 0) {
      return res.status(400).json({ error: 'No questions match the selected criteria' });
    }

    // Shuffle and take requested count
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, allQuestions.length));

    const quiz = await prisma.quiz.create({
      data: {
        title: mode === 'exam' ? 'PMHNP Mock Exam' : `${category || 'All'} - ${bennerStage || 'All Stages'} Quiz`,
        mode,
        timeLimit: timeLimit || (mode === 'exam' ? 12600 : null), // 3.5 hours for exam
        questionCount: selected.length,
        category,
        bennerStage,
        questions: {
          create: selected.map((q, i) => ({
            questionId: q.id,
            sortOrder: i
          }))
        }
      }
    });

    // Create attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId: quiz.id,
        totalQuestions: selected.length
      }
    });

    res.status(201).json({ quizId: quiz.id, attemptId: attempt.id, questionCount: selected.length });
  } catch (error) {
    console.error('Quiz create error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Get quiz questions for an active attempt
router.get('/:quizId/questions', authenticate, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.quizId },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            question: {
              select: {
                id: true, stem: true, optionA: true, optionB: true,
                optionC: true, optionD: true, category: true, subtopic: true,
                difficulty: true, bennerStage: true, clinicalReasoningObj: true,
                correctAnswer: true, rationale: true, explanationA: true,
                explanationB: true, explanationC: true, explanationD: true, examTip: true,
                questionType: true, clinicalTopic: true, pharmacologyFocus: true, bennerBreakdown: true
              }
            }
          }
        }
      }
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        mode: quiz.mode,
        timeLimit: quiz.timeLimit,
        questionCount: quiz.questionCount
      },
      questions: quiz.questions.map(qq => qq.question)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Submit answer
router.post('/:attemptId/answer', authenticate, async (req, res) => {
  try {
    const { questionId, selectedAnswer, timeSpent = 0, flagged = false } = req.body;

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = selectedAnswer === question.correctAnswer;

    const answer = await prisma.quizAnswer.upsert({
      where: { attemptId_questionId: { attemptId: req.params.attemptId, questionId } },
      update: { selectedAnswer, isCorrect, timeSpent, flagged },
      create: {
        attemptId: req.params.attemptId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent,
        flagged
      }
    });

    // Update user progress
    await prisma.userProgress.upsert({
      where: {
        userId_category_bennerStage: {
          userId: req.user.id,
          category: question.category,
          bennerStage: question.bennerStage
        }
      },
      update: {
        totalAnswered: { increment: 1 },
        ...(isCorrect ? { totalCorrect: { increment: 1 } } : {})
      },
      create: {
        userId: req.user.id,
        category: question.category,
        bennerStage: question.bennerStage,
        totalAnswered: 1,
        totalCorrect: isCorrect ? 1 : 0
      }
    });

    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      rationale: question.rationale,
      explanationA: question.explanationA,
      explanationB: question.explanationB,
      explanationC: question.explanationC,
      explanationD: question.explanationD,
      examTip: question.examTip,
      bennerBreakdown: question.bennerBreakdown,
      clinicalTopic: question.clinicalTopic,
      pharmacologyFocus: question.pharmacologyFocus,
      questionType: question.questionType
    });
  } catch (error) {
    console.error('Answer submit error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Complete quiz attempt
router.post('/:attemptId/complete', authenticate, async (req, res) => {
  try {
    const { timeSpent } = req.body;
    const answers = await prisma.quizAnswer.findMany({
      where: { attemptId: req.params.attemptId }
    });

    const score = answers.filter(a => a.isCorrect).length;

    const attempt = await prisma.quizAttempt.update({
      where: { id: req.params.attemptId },
      data: {
        completed: true,
        score,
        timeSpent: timeSpent || answers.reduce((sum, a) => sum + a.timeSpent, 0),
        completedAt: new Date()
      }
    });

    res.json({ score, totalQuestions: attempt.totalQuestions, percentage: Math.round((score / attempt.totalQuestions) * 100) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete quiz' });
  }
});

// Get attempt results
router.get('/:attemptId/results', authenticate, async (req, res) => {
  try {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: req.params.attemptId },
      include: {
        quiz: true,
        answers: {
          include: {
            attempt: {
              include: {
                quiz: {
                  include: {
                    questions: {
                      include: { question: true },
                      orderBy: { sortOrder: 'asc' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build detailed results
    const questions = attempt.quiz.questions || [];
    const answersMap = {};
    attempt.answers.forEach(a => { answersMap[a.questionId] = a; });

    // No need for the nested includes, re-fetch cleanly
    const quizWithQuestions = await prisma.quiz.findUnique({
      where: { id: attempt.quizId },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: { question: true }
        }
      }
    });

    const detailedAnswers = quizWithQuestions.questions.map(qq => {
      const ans = answersMap[qq.questionId];
      return {
        question: qq.question,
        selectedAnswer: ans?.selectedAnswer || null,
        isCorrect: ans?.isCorrect || false,
        timeSpent: ans?.timeSpent || 0,
        flagged: ans?.flagged || false
      };
    });

    // Category breakdown
    const byCategory = {};
    const byStage = {};
    const byClinicalTopic = {};
    detailedAnswers.forEach(da => {
      const cat = da.question.category;
      const stage = da.question.bennerStage;
      const topic = da.question.clinicalTopic;
      if (!byCategory[cat]) byCategory[cat] = { total: 0, correct: 0 };
      if (!byStage[stage]) byStage[stage] = { total: 0, correct: 0 };
      byCategory[cat].total++;
      byStage[stage].total++;
      if (topic) {
        if (!byClinicalTopic[topic]) byClinicalTopic[topic] = { total: 0, correct: 0 };
        byClinicalTopic[topic].total++;
        if (da.isCorrect) byClinicalTopic[topic].correct++;
      }
      if (da.isCorrect) {
        byCategory[cat].correct++;
        byStage[stage].correct++;
      }
    });

    res.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
        timeSpent: attempt.timeSpent,
        completed: attempt.completed,
        mode: attempt.quiz.mode
      },
      answers: detailedAnswers,
      breakdown: { byCategory, byStage, byClinicalTopic }
    });
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get user's quiz history
router.get('/history/me', authenticate, async (req, res) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.user.id, completed: true },
      include: { quiz: { select: { title: true, mode: true, category: true, bennerStage: true } } },
      orderBy: { completedAt: 'desc' },
      take: 20
    });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
