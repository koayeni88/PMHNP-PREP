import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get comprehensive analytics for the current user
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Overall progress
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: [{ category: 'asc' }, { bennerStage: 'asc' }]
    });

    // Recent attempts
    const recentAttempts = await prisma.quizAttempt.findMany({
      where: { userId, completed: true },
      include: { quiz: { select: { title: true, mode: true } } },
      orderBy: { completedAt: 'desc' },
      take: 10
    });

    // Total stats
    const totalAnswered = progress.reduce((s, p) => s + p.totalAnswered, 0);
    const totalCorrect = progress.reduce((s, p) => s + p.totalCorrect, 0);

    // By category
    const byCategory = {};
    progress.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = { answered: 0, correct: 0 };
      byCategory[p.category].answered += p.totalAnswered;
      byCategory[p.category].correct += p.totalCorrect;
    });

    // By Benner stage
    const byBennerStage = {};
    const stageOrder = ['novice', 'advanced_beginner', 'competent', 'proficient', 'expert'];
    progress.forEach(p => {
      if (!byBennerStage[p.bennerStage]) byBennerStage[p.bennerStage] = { answered: 0, correct: 0 };
      byBennerStage[p.bennerStage].answered += p.totalAnswered;
      byBennerStage[p.bennerStage].correct += p.totalCorrect;
    });

    // Determine current Benner level based on mastery
    let currentBennerLevel = 'novice';
    for (const stage of stageOrder) {
      const stageData = byBennerStage[stage];
      if (stageData && stageData.answered >= 5 && (stageData.correct / stageData.answered) >= 0.7) {
        currentBennerLevel = stage;
      } else {
        break;
      }
    }

    // Recommended next stage
    const currentIdx = stageOrder.indexOf(currentBennerLevel);
    const recommendedStage = stageOrder[Math.min(currentIdx + 1, stageOrder.length - 1)];

    // Quiz count
    const quizCount = await prisma.quizAttempt.count({ where: { userId, completed: true } });

    // Clinical topic performance (from quiz answers)
    const topicAnswers = await prisma.quizAnswer.findMany({
      where: { attempt: { userId, completed: true } },
      select: {
        isCorrect: true,
        attemptId: true,
        questionId: true
      }
    });
    const topicQuestionIds = [...new Set(topicAnswers.map(a => a.questionId))];
    const topicQuestions = topicQuestionIds.length > 0 ? await prisma.question.findMany({
      where: { id: { in: topicQuestionIds }, clinicalTopic: { not: '' } },
      select: { id: true, clinicalTopic: true }
    }) : [];
    const topicMap = {};
    topicQuestions.forEach(q => { topicMap[q.id] = q.clinicalTopic; });
    const byClinicalTopic = {};
    topicAnswers.forEach(a => {
      const topic = topicMap[a.questionId];
      if (!topic) return;
      if (!byClinicalTopic[topic]) byClinicalTopic[topic] = { answered: 0, correct: 0 };
      byClinicalTopic[topic].answered++;
      if (a.isCorrect) byClinicalTopic[topic].correct++;
    });

    res.json({
      overview: {
        totalAnswered,
        totalCorrect,
        accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
        quizzesTaken: quizCount,
        currentBennerLevel,
        recommendedStage
      },
      byCategory: Object.entries(byCategory).map(([name, data]) => ({
        name,
        answered: data.answered,
        correct: data.correct,
        accuracy: data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0
      })),
      byBennerStage: stageOrder.map(stage => ({
        stage,
        answered: byBennerStage[stage]?.answered || 0,
        correct: byBennerStage[stage]?.correct || 0,
        accuracy: byBennerStage[stage]?.answered > 0
          ? Math.round((byBennerStage[stage].correct / byBennerStage[stage].answered) * 100) : 0,
        mastered: byBennerStage[stage]?.answered >= 5 &&
          (byBennerStage[stage].correct / byBennerStage[stage].answered) >= 0.7
      })),
      progressMatrix: progress.map(p => ({
        category: p.category,
        bennerStage: p.bennerStage,
        answered: p.totalAnswered,
        correct: p.totalCorrect,
        accuracy: p.totalAnswered > 0 ? Math.round((p.totalCorrect / p.totalAnswered) * 100) : 0
      })),
      recentAttempts: recentAttempts.map(a => ({
        id: a.id,
        title: a.quiz.title,
        mode: a.quiz.mode,
        score: a.score,
        totalQuestions: a.totalQuestions,
        percentage: Math.round((a.score / a.totalQuestions) * 100),
        timeSpent: a.timeSpent,
        completedAt: a.completedAt
      })),
      byClinicalTopic: Object.entries(byClinicalTopic).map(([name, data]) => ({
        name,
        answered: data.answered,
        correct: data.correct,
        accuracy: data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0
      }))
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Pass likelihood analysis
router.get('/pass-likelihood', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Gather all progress data
    const progress = await prisma.userProgress.findMany({ where: { userId } });
    const totalAnswered = progress.reduce((s, p) => s + p.totalAnswered, 0);
    const totalCorrect = progress.reduce((s, p) => s + p.totalCorrect, 0);
    const overallAccuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

    // Category performance
    const byCategory = {};
    progress.forEach((p) => {
      if (!byCategory[p.category]) byCategory[p.category] = { answered: 0, correct: 0 };
      byCategory[p.category].answered += p.totalAnswered;
      byCategory[p.category].correct += p.totalCorrect;
    });

    const categoryScores = Object.entries(byCategory).map(([name, d]) => ({
      name,
      accuracy: d.answered > 0 ? d.correct / d.answered : 0,
      answered: d.answered,
      sufficient: d.answered >= 10,
    }));

    // Benner stage mastery
    const stageOrder = ['novice', 'advanced_beginner', 'competent', 'proficient', 'expert'];
    const byStage = {};
    progress.forEach((p) => {
      if (!byStage[p.bennerStage]) byStage[p.bennerStage] = { answered: 0, correct: 0 };
      byStage[p.bennerStage].answered += p.totalAnswered;
      byStage[p.bennerStage].correct += p.totalCorrect;
    });

    let highestMasteredStage = -1;
    stageOrder.forEach((stage, idx) => {
      const d = byStage[stage];
      if (d && d.answered >= 5 && d.correct / d.answered >= 0.7) {
        highestMasteredStage = idx;
      }
    });

    // Clinical topic coverage
    const topicAnswers = await prisma.quizAnswer.findMany({
      where: { attempt: { userId, completed: true } },
      include: { question: { select: { clinicalTopic: true } } },
    });
    const topicPerf = {};
    topicAnswers.forEach((a) => {
      const topic = a.question.clinicalTopic;
      if (!topic) return;
      if (!topicPerf[topic]) topicPerf[topic] = { correct: 0, total: 0 };
      topicPerf[topic].total++;
      if (a.isCorrect) topicPerf[topic].correct++;
    });

    const topicsCovered = Object.keys(topicPerf).length;
    const topicsAbove70 = Object.values(topicPerf).filter(
      (d) => d.total >= 3 && d.correct / d.total >= 0.7
    ).length;

    // Recent trend (last 5 quizzes vs previous 5)
    const recentAttempts = await prisma.quizAttempt.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: 'desc' },
      take: 10,
      select: { score: true, totalQuestions: true },
    });

    let trend = 'stable';
    if (recentAttempts.length >= 6) {
      const recent5 = recentAttempts.slice(0, 5);
      const prev5 = recentAttempts.slice(5, 10);
      const recentAvg = recent5.reduce((s, a) => s + a.score / a.totalQuestions, 0) / recent5.length;
      const prevAvg = prev5.reduce((s, a) => s + a.score / a.totalQuestions, 0) / prev5.length;
      if (recentAvg - prevAvg > 0.05) trend = 'improving';
      else if (prevAvg - recentAvg > 0.05) trend = 'declining';
    }

    // Composite pass likelihood score (0-100)
    // Weights: accuracy 40%, stage mastery 20%, topic coverage 20%, volume 10%, trend 10%
    const accuracyScore = Math.min(overallAccuracy / 0.85, 1) * 40; // 85%+ = full marks
    const stageScore = Math.min((highestMasteredStage + 1) / 4, 1) * 20; // proficient+ = full marks
    const coverageScore = (topicsCovered > 0 ? Math.min(topicsAbove70 / Math.max(topicsCovered, 1), 1) : 0) * 20;
    const volumeScore = Math.min(totalAnswered / 200, 1) * 10; // 200+ questions = full marks
    const trendScore = (trend === 'improving' ? 1 : trend === 'stable' ? 0.7 : 0.4) * 10;

    const composite = Math.round(accuracyScore + stageScore + coverageScore + volumeScore + trendScore);

    let likelihood, message;
    if (composite >= 80) {
      likelihood = 'high';
      message = 'Strong performance across categories. You are well-prepared for the exam.';
    } else if (composite >= 60) {
      likelihood = 'moderate';
      message = 'Solid foundation but some areas need improvement. Focus on weak topics.';
    } else if (composite >= 40) {
      likelihood = 'developing';
      message = 'Making progress but more practice is needed. Increase daily question volume and target weak areas.';
    } else {
      likelihood = 'early';
      message = 'Early in your preparation. Continue building foundational knowledge across all categories.';
    }

    // Identify weakest areas
    const weakAreas = categoryScores
      .filter((c) => c.answered >= 3 && c.accuracy < 0.7)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map((c) => ({ name: c.name, accuracy: Math.round(c.accuracy * 100) }));

    const weakTopics = Object.entries(topicPerf)
      .filter(([, d]) => d.total >= 3 && d.correct / d.total < 0.7)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .slice(0, 5)
      .map(([name, d]) => ({ name, accuracy: Math.round((d.correct / d.total) * 100) }));

    res.json({
      composite,
      likelihood,
      message,
      trend,
      breakdown: {
        accuracy: { score: Math.round(accuracyScore), max: 40, value: Math.round(overallAccuracy * 100) },
        stageMastery: { score: Math.round(stageScore), max: 20, level: stageOrder[highestMasteredStage] || 'none' },
        topicCoverage: { score: Math.round(coverageScore), max: 20, covered: topicsCovered, passing: topicsAbove70 },
        volume: { score: Math.round(volumeScore), max: 10, answered: totalAnswered },
        trend: { score: Math.round(trendScore), max: 10, direction: trend },
      },
      weakAreas,
      weakTopics,
      recommendations: buildRecommendations(likelihood, weakAreas, weakTopics, totalAnswered, trend),
    });
  } catch (error) {
    console.error('Pass likelihood error:', error);
    res.status(500).json({ error: 'Failed to calculate pass likelihood' });
  }
});

function buildRecommendations(likelihood, weakAreas, weakTopics, totalAnswered, trend) {
  const recs = [];

  if (totalAnswered < 50) {
    recs.push('Complete at least 50 practice questions across all categories to establish a baseline.');
  }
  if (weakAreas.length > 0) {
    recs.push(`Focus on weak categories: ${weakAreas.map((a) => a.name).join(', ')}.`);
  }
  if (weakTopics.length > 0) {
    recs.push(`Target these clinical topics: ${weakTopics.map((t) => t.name).join(', ')}.`);
  }
  if (trend === 'declining') {
    recs.push('Your recent scores show a decline. Review fundamentals and consider shorter, focused study sessions.');
  }
  if (likelihood === 'high') {
    recs.push('Shift to timed exam simulations to build test-day stamina.');
  }
  if (likelihood === 'moderate') {
    recs.push('Increase daily question count and review rationales for incorrect answers.');
  }

  return recs.length > 0 ? recs : ['Keep up consistent daily practice across all categories.'];
}

export default router;
