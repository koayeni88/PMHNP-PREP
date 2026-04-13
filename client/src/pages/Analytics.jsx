import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { BENNER_STAGES, CATEGORIES, BODY_SYSTEMS, getBennerLabel, getClinicalTopicLabel, getClinicalTopicIcon } from '../utils/constants.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6'];

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

  // Prepare chart data
  const categoryChartData = byCategory.map((cat) => {
    const info = CATEGORIES.find(c => c.key === cat.name);
    return { name: info?.label || cat.name, accuracy: cat.accuracy, correct: cat.correct, answered: cat.answered };
  });

  const bennerChartData = byBennerStage.map((stage) => ({
    name: getBennerLabel(stage.stage),
    accuracy: stage.accuracy,
    answered: stage.answered,
    correct: stage.correct,
    mastered: stage.mastered,
  }));

  const radarData = byBennerStage.map((stage) => ({
    subject: getBennerLabel(stage.stage),
    accuracy: stage.accuracy,
    fullMark: 100,
  }));

  const quizTrendData = [...recentAttempts].reverse().map((a, i) => ({
    name: `Quiz ${i + 1}`,
    score: a.percentage,
    date: new Date(a.completedAt).toLocaleDateString(),
    title: a.title,
  }));

  const pieData = byCategory.map((cat) => {
    const info = CATEGORIES.find(c => c.key === cat.name);
    return { name: info?.label || cat.name, value: cat.answered };
  });

  const clinicalTopicChartData = (byClinicalTopic || [])
    .sort((a, b) => b.answered - a.answered)
    .slice(0, 12)
    .map((t) => ({
      name: getClinicalTopicLabel(t.name),
      accuracy: t.accuracy,
      correct: t.correct,
      answered: t.answered,
    }));

  // Body System proficiency data — aggregate clinical topics per body system
  const SYSTEM_COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#06b6d4', '#f97316', '#eab308', '#14b8a6', '#f43f5e', '#22c55e', '#ec4899', '#818cf8', '#dc2626'];
  const bodySystemData = BODY_SYSTEMS.map((sys, i) => {
    const topics = (byClinicalTopic || []).filter((t) => sys.clinicalTopics.includes(t.name));
    const answered = topics.reduce((s, t) => s + t.answered, 0);
    const correct = topics.reduce((s, t) => s + t.correct, 0);
    return {
      key: sys.key,
      name: sys.label,
      icon: sys.icon,
      color: SYSTEM_COLORS[i % SYSTEM_COLORS.length],
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      correct,
      answered,
    };
  });

  const bodySystemRadarData = bodySystemData.map((s) => ({
    subject: s.name,
    accuracy: s.accuracy,
    fullMark: 100,
  }));

  const getProficiencyLevel = (accuracy, answered) => {
    if (answered === 0) return { label: 'Not Started', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
    if (accuracy >= 90) return { label: 'Expert', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
    if (accuracy >= 75) return { label: 'Proficient', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    if (accuracy >= 60) return { label: 'Competent', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (accuracy >= 40) return { label: 'Developing', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { label: 'Novice', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' };
  };

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

      {/* Category Performance — Bar Chart + Pie Chart */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Category Accuracy</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
                formatter={(value, name) => [`${value}%`, 'Accuracy']}
              />
              <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                {categoryChartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Questions by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benner Stage — Bar Chart + Radar */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Benner Stage Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bennerChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
                formatter={(value, name) => {
                  if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="accuracy" name="Accuracy %" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="answered" name="Questions" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Competency Radar</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
                formatter={(value) => [`${value}%`, 'Accuracy']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz Score Trend — Line Chart */}
      {quizTrendData.length > 1 && (
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 Quiz Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quizTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.title || ''}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }} activeDot={{ r: 7 }} />
              {/* 70% pass threshold reference line */}
              <Line type="monotone" dataKey={() => 70} stroke="#ef4444" strokeDasharray="5 5"
                strokeWidth={1} dot={false} name="Pass Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Body System Proficiency */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">🫀 Body System Proficiency</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your accuracy and proficiency level across all body systems</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar */}
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={bodySystemRadarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Proficiency Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bodySystemData.map((sys) => {
              const prof = getProficiencyLevel(sys.accuracy, sys.answered);
              return (
                <div key={sys.key} className={`rounded-xl p-3 ${prof.bg} border border-gray-200 dark:border-gray-700`}>
                  <div className="text-2xl mb-1">{sys.icon}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{sys.name}</div>
                  <div className="text-2xl font-bold mt-1" style={{ color: sys.color }}>
                    {sys.answered > 0 ? `${sys.accuracy}%` : '—'}
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${prof.color}`}>{prof.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sys.correct}/{sys.answered} correct</div>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${sys.accuracy}%`, backgroundColor: sys.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clinical Topic Performance — Horizontal Bar Chart */}
      {clinicalTopicChartData.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔬 Clinical Topic Performance</h2>
          <ResponsiveContainer width="100%" height={Math.max(300, clinicalTopicChartData.length * 40)}>
            <BarChart data={clinicalTopicChartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={95} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#fff' }}
                formatter={(value, name) => {
                  if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
                  return [value, name];
                }}
              />
              <Bar dataKey="accuracy" name="Accuracy %" radius={[0, 8, 8, 0]}>
                {clinicalTopicChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.accuracy >= 70 ? '#22c55e' : entry.accuracy >= 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
