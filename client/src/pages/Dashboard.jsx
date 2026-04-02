import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useAuthStore } from '../store/index.js';
import { BENNER_STAGES, CATEGORIES, getBennerLabel, formatTime } from '../utils/constants.js';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load dashboard</div>;

  const { overview, byCategory, byBennerStage, recentAttempts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your study progress overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Questions Answered" value={overview.totalAnswered} />
        <StatCard label="Overall Accuracy" value={`${overview.accuracy}%`} accent />
        <StatCard label="Quizzes Taken" value={overview.quizzesTaken} />
        <StatCard label="Current Level" value={getBennerLabel(overview.currentBennerLevel)} />
      </div>

      {/* Benner Progression Ladder */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Clinical Reasoning Ladder</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {byBennerStage.map((stage, i) => {
            const isActive = stage.stage === overview.currentBennerLevel;
            const isMastered = stage.mastered;
            return (
              <div key={stage.stage} className="flex-1 relative">
                <Link to={`/study/benner/${stage.stage}`}
                  className={`block p-4 rounded-xl border-2 transition-all hover:shadow-md
                    ${isActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' :
                      isMastered ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :
                      'border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stage {i + 1}
                    </span>
                    {isMastered && <span className="text-green-500">✓</span>}
                    {isActive && <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {getBennerLabel(stage.stage)}
                  </h3>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{stage.answered} answered</span>
                      <span>{stage.accuracy}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${Math.min(stage.accuracy, 100)}%` }} />
                    </div>
                  </div>
                </Link>
                {i < byBennerStage.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 text-gray-300 dark:text-gray-600 z-10">→</div>
                )}
              </div>
            );
          })}
        </div>
        {overview.recommendedStage !== overview.currentBennerLevel && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              💡 Recommended: Study <strong>{getBennerLabel(overview.recommendedStage)}</strong> level questions next
            </span>
            <Link to={`/study/benner/${overview.recommendedStage}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Start →
            </Link>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 3P Category Breakdown */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance by Category</h2>
          <div className="space-y-4">
            {byCategory.map((cat) => {
              const catInfo = CATEGORIES.find(c => c.key === cat.name);
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <span>{catInfo?.icon}</span> {cat.name}
                    </span>
                    <span className="text-sm text-gray-500">{cat.correct}/{cat.answered} ({cat.accuracy}%)</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className={`h-full rounded-full transition-all ${
                      cat.accuracy >= 80 ? 'bg-green-500' : cat.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${cat.accuracy}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No quizzes taken yet</p>
              <Link to="/quiz/builder" className="text-primary-600 font-medium mt-2 inline-block">
                Start your first quiz →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.slice(0, 5).map((attempt) => (
                <Link key={attempt.id} to={`/quiz/${attempt.id}/results`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{attempt.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(attempt.completedAt).toLocaleDateString()} · {formatTime(attempt.timeSpent)}
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${
                    attempt.percentage >= 80 ? 'text-green-500' : attempt.percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {attempt.percentage}%
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Link to="/quiz/builder" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-bold text-gray-900 dark:text-white">Custom Quiz</h3>
          <p className="text-sm text-gray-500">Build a targeted practice quiz</p>
        </Link>
        <Link to="/quiz/builder?mode=exam" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-bold text-gray-900 dark:text-white">Mock Exam</h3>
          <p className="text-sm text-gray-500">Full 150-question simulation</p>
        </Link>
        <Link to="/questions" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="font-bold text-gray-900 dark:text-white">Browse Questions</h3>
          <p className="text-sm text-gray-500">Explore the question bank</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card text-center">
      <p className={`text-2xl font-bold ${accent ? 'text-primary-600' : 'text-gray-900 dark:text-white'}`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );
}
