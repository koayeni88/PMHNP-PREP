import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api.js';
import { getBennerBadgeClass, getBennerLabel, formatTime, getClinicalTopicLabel } from '../utils/constants.js';

export default function QuizResults() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    api.getResults(attemptId).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load results</div>;

  const { attempt, answers, breakdown } = data;
  const passed = attempt.percentage >= 70;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Score Header */}
      <div className={`card text-center mb-8 ${passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
        <div className={`text-6xl font-extrabold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {attempt.percentage}%
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {passed ? '🎉 Passed!' : 'Keep Studying!'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {attempt.score} of {attempt.totalQuestions} correct · {formatTime(attempt.timeSpent)}
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* By Category */}
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">By Category</h2>
          {Object.entries(breakdown.byCategory).map(([cat, data]) => (
            <div key={cat} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{cat}</span>
                <span className="text-gray-500">{data.correct}/{data.total} ({Math.round((data.correct/data.total)*100)}%)</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className={`h-full rounded-full ${
                  (data.correct/data.total) >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                }`} style={{ width: `${(data.correct/data.total)*100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* By Benner Stage */}
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">By Benner Stage</h2>
          {Object.entries(breakdown.byStage).map(([stage, data]) => (
            <div key={stage} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{getBennerLabel(stage)}</span>
                <span className="text-gray-500">{data.correct}/{data.total} ({Math.round((data.correct/data.total)*100)}%)</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className={`h-full rounded-full ${
                  (data.correct/data.total) >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                }`} style={{ width: `${(data.correct/data.total)*100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Clinical Topic */}
      {breakdown.byClinicalTopic && Object.keys(breakdown.byClinicalTopic).length > 0 && (
        <div className="card mb-8">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">🔬 By Clinical Topic</h2>
          <div className="grid md:grid-cols-2 gap-x-6">
          {Object.entries(breakdown.byClinicalTopic).map(([topic, data]) => (
            <div key={topic} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{getClinicalTopicLabel(topic)}</span>
                <span className="text-gray-500">{data.correct}/{data.total} ({Math.round((data.correct/data.total)*100)}%)</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className={`h-full rounded-full ${
                  (data.correct/data.total) >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                }`} style={{ width: `${(data.correct/data.total)*100}%` }} />
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => setShowDetails(!showDetails)} className="btn-secondary">
          {showDetails ? 'Hide' : 'Show'} Question Details
        </button>
        <Link to="/quiz/builder" className="btn-primary">Take Another Quiz</Link>
        <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
      </div>

      {/* Detailed Review */}
      {showDetails && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Question Review</h2>
          {answers.map((a, i) => (
            <div key={i} className={`card border-l-4 ${a.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                <span className={getBennerBadgeClass(a.question.bennerStage)}>
                  {getBennerLabel(a.question.bennerStage)}
                </span>
                {a.question.questionType === 'advanced' && (
                  <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                    🔬 Advanced
                  </span>
                )}
                {a.question.clinicalTopic && (
                  <span className="badge bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 text-xs">
                    {getClinicalTopicLabel(a.question.clinicalTopic)}
                  </span>
                )}
                <span className={`text-sm font-bold ${a.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {a.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
                {a.flagged && <span className="text-yellow-500">🚩</span>}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">{a.question.stem}</p>
              <div className="text-xs text-gray-500">
                Your answer: <strong>{a.selectedAnswer || 'Skipped'}</strong> · 
                Correct: <strong>{a.question.correctAnswer}</strong>
              </div>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                {a.question.rationale}
              </div>
              {a.question.bennerBreakdown && (
                <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">🎯 Benner Breakdown: </span>
                  <span className="text-indigo-800 dark:text-indigo-200">{a.question.bennerBreakdown}</span>
                </div>
              )}
              {a.question.pharmacologyFocus && (
                <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {a.question.pharmacologyFocus.includes('moa') && (
                    <div className="mb-2 p-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded border-l-4 border-blue-500">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300">⚗️ MOA FOCUS</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {a.question.pharmacologyFocus.split(',').map((tag, j) => {
                      const cleanTag = tag.trim().replace(/_/g, ' ');
                      const isMOA = tag.trim() === 'moa';
                      return (
                        <span 
                          key={j} 
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                            isMOA 
                              ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow' 
                              : 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {isMOA ? '⚡ ' : '💊 '}{cleanTag.toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
