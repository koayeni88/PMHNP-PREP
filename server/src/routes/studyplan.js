import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const TIMELINE_CONFIGS = {
  '2_week': { days: 14, dailyGoal: 40, name: '2-Week Intensive' },
  '4_week': { days: 28, dailyGoal: 30, name: '4-Week Standard' },
  '8_week': { days: 56, dailyGoal: 20, name: '8-Week Comprehensive' },
  '12_week': { days: 84, dailyGoal: 15, name: '12-Week Mastery' },
};

// Get all study plans for user
router.get('/', authenticate, async (req, res) => {
  try {
    const plans = await prisma.studyPlan.findMany({
      where: { userId: req.user.id },
      include: { dailyLogs: { orderBy: { date: 'desc' }, take: 7 } },
      orderBy: { createdAt: 'desc' },
    });

    const plansWithStats = plans.map((plan) => {
      const totalCompleted = plan.dailyLogs.reduce((s, l) => s + l.questionsCompleted, 0);
      const totalCorrect = plan.dailyLogs.reduce((s, l) => s + l.questionsCorrect, 0);
      const daysLogged = plan.dailyLogs.length;
      const totalDays = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.ceil((new Date() - new Date(plan.startDate)) / (1000 * 60 * 60 * 24));

      return {
        ...plan,
        stats: {
          totalCompleted,
          totalCorrect,
          accuracy: totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0,
          daysLogged,
          totalDays,
          daysElapsed: Math.min(daysElapsed, totalDays),
          progressPercent: Math.min(Math.round((daysElapsed / totalDays) * 100), 100),
          onTrack: daysLogged >= Math.floor(daysElapsed * 0.7),
        },
      };
    });

    res.json(plansWithStats);
  } catch (error) {
    console.error('Study plans fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch study plans' });
  }
});

// Create a study plan
router.post('/', authenticate, async (req, res) => {
  try {
    const { timeline, focusTopics, customName, dailyGoal: customDailyGoal } = req.body;

    const config = TIMELINE_CONFIGS[timeline];
    if (!config) {
      return res.status(400).json({ error: 'Invalid timeline. Use: 2_week, 4_week, 8_week, 12_week' });
    }

    // Deactivate any existing active plans
    await prisma.studyPlan.updateMany({
      where: { userId: req.user.id, isActive: true },
      data: { isActive: false },
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + config.days);

    const plan = await prisma.studyPlan.create({
      data: {
        userId: req.user.id,
        name: customName || config.name,
        timeline,
        startDate,
        endDate,
        dailyGoal: customDailyGoal || config.dailyGoal,
        focusTopics: Array.isArray(focusTopics) ? focusTopics.join(',') : (focusTopics || ''),
        isActive: true,
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Study plan create error:', error);
    res.status(500).json({ error: 'Failed to create study plan' });
  }
});

// Get active study plan with today's recommendation
router.get('/active', authenticate, async (req, res) => {
  try {
    const plan = await prisma.studyPlan.findFirst({
      where: { userId: req.user.id, isActive: true },
      include: {
        dailyLogs: { orderBy: { date: 'desc' } },
      },
    });

    if (!plan) {
      return res.json(null);
    }

    // Calculate today's progress
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayLog = plan.dailyLogs.find(
      (l) => new Date(l.date).toDateString() === todayStart.toDateString()
    );

    // Determine weak topics based on user's quiz history
    const recentAnswers = await prisma.quizAnswer.findMany({
      where: { attempt: { userId: req.user.id, completed: true } },
      include: { question: { select: { clinicalTopic: true, category: true } } },
      orderBy: { attempt: { completedAt: 'desc' } },
      take: 200,
    });

    const topicPerf = {};
    recentAnswers.forEach((a) => {
      const topic = a.question.clinicalTopic || a.question.category;
      if (!topicPerf[topic]) topicPerf[topic] = { correct: 0, total: 0 };
      topicPerf[topic].total++;
      if (a.isCorrect) topicPerf[topic].correct++;
    });

    const weakTopics = Object.entries(topicPerf)
      .filter(([, d]) => d.total >= 3 && d.correct / d.total < 0.7)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .slice(0, 5)
      .map(([name, d]) => ({ name, accuracy: Math.round((d.correct / d.total) * 100), total: d.total }));

    // Build recommendation
    const focusTopicsList = plan.focusTopics ? plan.focusTopics.split(',').filter(Boolean) : [];
    const totalDays = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.max(1, Math.ceil((new Date() - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);

    const totalCompleted = plan.dailyLogs.reduce((s, l) => s + l.questionsCompleted, 0);
    const totalCorrect = plan.dailyLogs.reduce((s, l) => s + l.questionsCorrect, 0);
    const streak = calculateStreak(plan.dailyLogs);

    res.json({
      plan: {
        id: plan.id,
        name: plan.name,
        timeline: plan.timeline,
        startDate: plan.startDate,
        endDate: plan.endDate,
        dailyGoal: plan.dailyGoal,
        focusTopics: focusTopicsList,
        isActive: plan.isActive,
      },
      today: {
        questionsCompleted: todayLog?.questionsCompleted || 0,
        questionsCorrect: todayLog?.questionsCorrect || 0,
        timeSpent: todayLog?.timeSpent || 0,
        goalRemaining: Math.max(0, plan.dailyGoal - (todayLog?.questionsCompleted || 0)),
      },
      overall: {
        totalCompleted,
        totalCorrect,
        accuracy: totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0,
        daysElapsed,
        daysRemaining,
        totalDays,
        progressPercent: Math.min(Math.round((daysElapsed / totalDays) * 100), 100),
        streak,
      },
      weakTopics,
      recommendedTopics: weakTopics.length > 0
        ? weakTopics.map((t) => t.name)
        : focusTopicsList.length > 0
          ? focusTopicsList
          : ['Pharmacology', 'Pathophysiology'],
    });
  } catch (error) {
    console.error('Active plan fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch active plan' });
  }
});

// Log daily study progress
router.post('/:planId/log', authenticate, async (req, res) => {
  try {
    const { planId } = req.params;
    const { questionsCompleted, questionsCorrect, timeSpent, topicsCovered } = req.body;

    // Verify plan belongs to user
    const plan = await prisma.studyPlan.findFirst({
      where: { id: planId, userId: req.user.id },
    });
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const log = await prisma.studyLog.upsert({
      where: { studyPlanId_date: { studyPlanId: planId, date: todayStart } },
      update: {
        questionsCompleted: { increment: questionsCompleted || 0 },
        questionsCorrect: { increment: questionsCorrect || 0 },
        timeSpent: { increment: timeSpent || 0 },
        topicsCovered: topicsCovered || '',
      },
      create: {
        studyPlanId: planId,
        date: todayStart,
        questionsCompleted: questionsCompleted || 0,
        questionsCorrect: questionsCorrect || 0,
        timeSpent: timeSpent || 0,
        topicsCovered: Array.isArray(topicsCovered) ? topicsCovered.join(',') : (topicsCovered || ''),
      },
    });

    res.json(log);
  } catch (error) {
    console.error('Study log error:', error);
    res.status(500).json({ error: 'Failed to log study progress' });
  }
});

// Delete a study plan
router.delete('/:planId', authenticate, async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await prisma.studyPlan.findFirst({
      where: { id: planId, userId: req.user.id },
    });
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    await prisma.studyPlan.delete({ where: { id: planId } });
    res.json({ message: 'Study plan deleted' });
  } catch (error) {
    console.error('Study plan delete error:', error);
    res.status(500).json({ error: 'Failed to delete study plan' });
  }
});

function calculateStreak(logs) {
  if (!logs.length) return 0;
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const logDate = new Date(sorted[i].date);
    logDate.setHours(0, 0, 0, 0);
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);

    if (logDate.getTime() === expected.getTime() && sorted[i].questionsCompleted > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default router;
