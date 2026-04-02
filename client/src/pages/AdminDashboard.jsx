import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { getBennerLabel, getClinicalTopicLabel } from '../utils/constants.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!stats) return <div className="p-8 text-center text-gray-500">Failed to load admin stats</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Platform management and analytics</p>
        </div>
        <Link to="/admin/questions" className="btn-primary">Manage Questions</Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{stats.userCount}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{stats.activeQuestions}</p>
          <p className="text-sm text-gray-500">Active Questions</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.attemptCount}</p>
          <p className="text-sm text-gray-500">Quiz Attempts</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.questionCount}</p>
          <p className="text-sm text-gray-500">Total Questions</p>
        </div>
      </div>

      {/* Distributions */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Questions by Category</h2>
          {stats.byCategory.map((c) => (
            <div key={c.category} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="text-gray-700 dark:text-gray-300">{c.category}</span>
              <span className="font-bold text-gray-900 dark:text-white">{c.count}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Questions by Benner Stage</h2>
          {stats.byStage.map((s) => (
            <div key={s.stage} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="text-gray-700 dark:text-gray-300">{getBennerLabel(s.stage)}</span>
              <span className="font-bold text-gray-900 dark:text-white">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type & Clinical Topic Distributions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {stats.byType && stats.byType.length > 0 && (
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Questions by Type</h2>
            {stats.byType.map((t) => (
              <div key={t.type} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-700 dark:text-gray-300">
                  {t.type === 'advanced' ? '🔬 Advanced' : 'Standard'}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{t.count}</span>
              </div>
            ))}
          </div>
        )}
        {stats.byClinicalTopic && stats.byClinicalTopic.length > 0 && (
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Questions by Clinical Topic</h2>
            {stats.byClinicalTopic.map((c) => (
              <div key={c.topic} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-700 dark:text-gray-300">{getClinicalTopicLabel(c.topic)}</span>
                <span className="font-bold text-gray-900 dark:text-white">{c.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
