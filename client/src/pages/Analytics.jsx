import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { BENNER_STAGES, CATEGORIES, getBennerLabel, getClinicalTopicLabel } from '../utils/constants.js';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load analytics</div>;

  const { overview, byCategory, byBennerStage, progressMatrix, recentAttempts, byClinicalTopic } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your performance insights and clinical reasoning development</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{overview.totalAnswered}</p>
          <p className="text-sm text-gray-500 mt-1">Total Answered</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{overview.accuracy}%</p>
          <p className="text-sm text-gray-500 mt-1">Overall Accuracy</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">{overview.quizzesTaken}</p>
          <p className="text-sm text-gray-500 mt-1">Quizzes Taken</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">{getBennerLabel(overview.currentBennerLevel)}</p>
          <p className="text-sm text-gray-500 mt-1">Current Level</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-cyan-600">{getBennerLabel(overview.recommendedStage)}</p>
          <p className="text-sm text-gray-500 mt-1">Recommended Next</p>
        </div>
      </div>

      {/* Category Performance */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Performance by 3P Category</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {byCategory.map((cat) => {
            const info = CATEGORIES.find(c => c.key === cat.name);
            return (
              <div key={cat.name} className="text-center">
                <div className="text-4xl mb-2">{info?.icon || ''}</div>
                <h3 className="font-bold text-gray-900 dark:text-white">{cat.name}</h3>
                <div className="mt-3 relative">
                  <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={cat.accuracy >= 70 ? '#22c55e' : '#ef4444'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${cat.accuracy * 2.51} 251`}
                      transform="rotate(-90 50 50)" />
                    <text x="50" y="55" textAnchor="middle" className="text-xl font-bold fill-current">{cat.accuracy}%</text>
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-2">{cat.correct}/{cat.answered} correct</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benner Stage Performance */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Performance by Benner Stage</h2>
        <div className="space-y-4">
          {byBennerStage.map((stage) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <div className="w-40 flex-shrink-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{getBennerLabel(stage.stage)}</p>
                <p className="text-xs text-gray-500">{stage.answered} questions</p>
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                  <div className={`h-full rounded-full transition-all flex items-center justify-end pr-2 ${
                    stage.accuracy >= 70 ? 'bg-green-500' : stage.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} style={{ width: `${Math.max(stage.accuracy, 5)}%` }}>
                    {stage.accuracy > 15 && (
                      <span className="text-xs text-white font-bold">{stage.accuracy}%</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-16 text-right">
                {stage.mastered ? (
                  <span className="text-green-500 font-bold text-sm">Mastered</span>
                ) : (
                  <span className="text-gray-400 text-sm">{stage.accuracy}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Matrix (3P x Benner) */}
      <div className="card mb-8 overflow-x-auto">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Detailed Progress Matrix</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 text-gray-500 font-medium">Category \ Stage</th>
              {BENNER_STAGES.map(s => (
                <th key={s.key} className="p-2 text-center text-gray-500 font-medium">{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(cat => (
              <tr key={cat.key} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-2 font-medium text-gray-900 dark:text-white">{cat.icon} {cat.label}</td>
                {BENNER_STAGES.map(stage => {
                  const cell = progressMatrix.find(p => p.category === cat.key && p.bennerStage === stage.key);
                  return (
                    <td key={stage.key} className="p-2 text-center">
                      {cell ? (
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-sm font-bold ${
                          cell.accuracy >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          cell.accuracy >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {cell.accuracy}%
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 text-xs">
                          —
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clinical Topic Performance */}
      {byClinicalTopic && byClinicalTopic.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">🔬 Performance by Clinical Topic</h2>
          <div className="space-y-4">
            {byClinicalTopic.map((topic) => (
              <div key={topic.name} className="flex items-center gap-4">
                <div className="w-48 flex-shrink-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{getClinicalTopicLabel(topic.name)}</p>
                  <p className="text-xs text-gray-500">{topic.answered} questions</p>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                    <div className={`h-full rounded-full transition-all flex items-center justify-end pr-2 ${
                      topic.accuracy >= 70 ? 'bg-green-500' : topic.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${Math.max(topic.accuracy, 5)}%` }}>
                      {topic.accuracy > 15 && (
                        <span className="text-xs text-white font-bold">{topic.accuracy}%</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-gray-500 text-sm">{topic.correct}/{topic.answered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Performance */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Quiz Performance</h2>
        {recentAttempts.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No quizzes completed yet</p>
        ) : (
          <div className="space-y-2">
            {recentAttempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-gray-500">{new Date(a.completedAt).toLocaleDateString()} · {a.mode}</p>
                </div>
                <span className={`text-lg font-bold ${
                  a.percentage >= 80 ? 'text-green-500' : a.percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>{a.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
