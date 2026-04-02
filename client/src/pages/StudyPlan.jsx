import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { CLINICAL_TOPICS, getClinicalTopicLabel } from '../utils/constants.js';

const TIMELINES = [
  { key: '2_week', label: '2-Week Intensive', days: 14, dailyGoal: 40, desc: 'High-intensity prep for those close to exam day' },
  { key: '4_week', label: '4-Week Standard', days: 28, dailyGoal: 30, desc: 'Balanced pace covering all major topics' },
  { key: '8_week', label: '8-Week Comprehensive', days: 56, dailyGoal: 20, desc: 'Thorough review with time for weak areas' },
  { key: '12_week', label: '12-Week Mastery', days: 84, dailyGoal: 15, desc: 'Deep mastery with spaced repetition' },
];

export default function StudyPlan() {
  const [activePlan, setActivePlan] = useState(null);
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState('4_week');
  const [focusTopics, setFocusTopics] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getActiveStudyPlan().catch(() => null),
      api.getPassLikelihood().catch(() => null),
    ]).then(([plan, pass]) => {
      setActivePlan(plan);
      setPassData(pass);
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.createStudyPlan({ timeline: selectedTimeline, focusTopics });
      const plan = await api.getActiveStudyPlan();
      setActivePlan(plan);
      setShowCreate(false);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (planId) => {
    try {
      await api.deleteStudyPlan(planId);
      setActivePlan(null);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTopic = (key) => {
    setFocusTopics((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📅 Study Plan</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Structured preparation with daily goals and progress tracking</p>
        </div>
        {!showCreate && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            {activePlan ? 'New Plan' : 'Create Plan'}
          </button>
        )}
      </div>

      {/* Pass Likelihood Section */}
      {passData && <PassLikelihoodCard data={passData} />}

      {/* Create Plan Form */}
      {showCreate && (
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Create Study Plan</h2>

          {/* Timeline Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Timeline</label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TIMELINES.map((t) => (
                <button key={t.key} onClick={() => setSelectedTimeline(t.key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTimeline === t.key
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.dailyGoal} questions/day</div>
                  <div className="text-xs text-gray-400 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Topics */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Focus Topics (optional — weak areas auto-detected)
            </label>
            <div className="flex flex-wrap gap-2">
              {CLINICAL_TOPICS.map((topic) => (
                <button key={topic.key} onClick={() => toggleTopic(topic.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    focusTopics.includes(topic.key)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}>
                  {topic.icon} {topic.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={creating} className="btn-primary">
              {creating ? 'Creating...' : 'Start Plan'}
            </button>
            <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Active Plan Dashboard */}
      {activePlan && activePlan.plan && (
        <ActivePlanDashboard plan={activePlan} onDelete={handleDelete} />
      )}

      {/* No Plan State */}
      {!activePlan && !showCreate && (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Study Plan</h2>
          <p className="text-gray-500 mb-6">Create a structured study plan to stay on track for your exam</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">Create Your First Plan</button>
        </div>
      )}
    </div>
  );
}

function PassLikelihoodCard({ data }) {
  const colorMap = {
    high: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', bar: 'bg-green-500' },
    moderate: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', bar: 'bg-blue-500' },
    developing: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-400', bar: 'bg-yellow-500' },
    early: { bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700', text: 'text-gray-700 dark:text-gray-400', bar: 'bg-gray-500' },
  };
  const colors = colorMap[data.likelihood] || colorMap.early;

  return (
    <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 mb-8`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Score */}
        <div className="flex items-center gap-4 lg:flex-shrink-0">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" className={colors.bar.replace('bg-', 'text-')} stroke="currentColor"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${data.composite * 2.51} 251`}
                transform="rotate(-90 50 50)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.composite}</span>
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${colors.text} capitalize`}>
              {data.likelihood} Likelihood
            </div>
            <div className="text-sm text-gray-500 mt-1">{data.message}</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(data.breakdown).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{val.score}/{val.max}</div>
              <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className={data.trend === 'improving' ? 'text-green-600' : data.trend === 'declining' ? 'text-red-600' : 'text-gray-500'}>
          {data.trend === 'improving' ? '📈' : data.trend === 'declining' ? '📉' : '➡️'}
          {' '}Trend: {data.trend}
        </span>
      </div>

      {/* Recommendations */}
      {data.recommendations?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations:</p>
          <ul className="space-y-1">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weak Areas */}
      {data.weakTopics?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weak Topics to Target:</p>
          <div className="flex flex-wrap gap-2">
            {data.weakTopics.map((t) => (
              <span key={t.name} className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                {getClinicalTopicLabel(t.name)} — {t.accuracy}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivePlanDashboard({ plan, onDelete }) {
  const { plan: planInfo, today, overall, weakTopics, recommendedTopics } = plan;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{planInfo.name}</h2>
            <p className="text-sm text-gray-500">
              {new Date(planInfo.startDate).toLocaleDateString()} — {new Date(planInfo.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              Active
            </span>
            <button onClick={() => onDelete(planInfo.id)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 flex justify-between text-xs text-gray-500">
          <span>Day {overall.daysElapsed} of {overall.totalDays}</span>
          <span>{overall.progressPercent}% timeline elapsed</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all"
            style={{ width: `${overall.progressPercent}%` }} />
        </div>
      </div>

      {/* Today's Progress + Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">
            {today.questionsCompleted}/{planInfo.dailyGoal}
          </p>
          <p className="text-sm text-gray-500 mt-1">Today's Goal</p>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3">
            <div className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${Math.min((today.questionsCompleted / planInfo.dailyGoal) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{overall.accuracy}%</p>
          <p className="text-sm text-gray-500 mt-1">Overall Accuracy</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">{overall.totalCompleted}</p>
          <p className="text-sm text-gray-500 mt-1">Total Questions</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-600">{overall.streak}🔥</p>
          <p className="text-sm text-gray-500 mt-1">Day Streak</p>
        </div>
      </div>

      {/* Today's Recommendation */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Today's Study Focus</h3>
        {today.goalRemaining > 0 ? (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have <span className="font-bold text-primary-600">{today.goalRemaining} questions</span> remaining today.
              {recommendedTopics?.length > 0 && (
                <> Focus on: <span className="font-medium">{recommendedTopics.map(getClinicalTopicLabel).join(', ')}</span></>
              )}
            </p>
            <Link to="/quiz/builder" className="btn-primary inline-flex items-center gap-2">
              Start Practice →
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-600 font-bold">Daily goal achieved!</p>
            <p className="text-sm text-gray-500 mt-1">Great work today. Come back tomorrow to keep your streak alive.</p>
          </div>
        )}
      </div>

      {/* Weak Topics */}
      {weakTopics?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Areas Needing Attention</h3>
          <div className="space-y-3">
            {weakTopics.map((topic) => (
              <div key={topic.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getClinicalTopicLabel(topic.name)}
                    </span>
                    <span className="text-sm text-gray-500">{topic.accuracy}% ({topic.total} Qs)</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className={`h-full rounded-full ${topic.accuracy < 50 ? 'bg-red-500' : 'bg-yellow-500'}`}
                      style={{ width: `${topic.accuracy}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Focus Topics */}
      {planInfo.focusTopics?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Plan Focus Topics</h3>
          <div className="flex flex-wrap gap-2">
            {planInfo.focusTopics.map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium">
                {getClinicalTopicLabel(t)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
