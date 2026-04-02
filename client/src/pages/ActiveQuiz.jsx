import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';
import { getBennerBadgeClass, getBennerLabel, formatTime, getClinicalTopicLabel } from '../utils/constants.js';

export default function ActiveQuiz() {
  const { attemptId } = useParams();
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quizId');
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (quizId) {
      api.getQuizQuestions(quizId).then((data) => {
        setQuiz(data.quiz);
        setQuestions(data.questions);
        if (data.quiz.timeLimit) setTimeLeft(data.quiz.timeLimit);
        setLoading(false);
      }).catch(console.error);
    }
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleFinish(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQ = questions[currentIndex];

  const handleSelect = async (option) => {
    if (answers[currentQ.id]) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    try {
      const result = await api.submitAnswer(attemptId, {
        questionId: currentQ.id,
        selectedAnswer: option,
        timeSpent: 0,
        flagged: flagged.has(currentQ.id)
      });
      setRevealed(prev => ({ ...prev, [currentQ.id]: result }));
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await api.completeQuiz(attemptId, { timeSpent: quiz?.timeLimit ? quiz.timeLimit - (timeLeft || 0) : 0 });
      navigate(`/quiz/${attemptId}/results`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">{quiz?.title}</h2>
            <p className="text-sm text-gray-500">
              Question {currentIndex + 1} of {questions.length} · {answeredCount} answered
            </p>
          </div>
          <div className="flex items-center gap-3">
            {timeLeft !== null && (
              <div className={`px-4 py-2 rounded-xl font-mono font-bold text-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}>
                {formatTime(timeLeft)}
              </div>
            )}
            <button onClick={() => setShowNav(!showNav)}
              className="btn-secondary text-sm">
              Navigator
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4">
          <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Navigator (collapsible) */}
      {showNav && (
        <div className="card mb-6">
          <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-3">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => (
              <button key={q.id} onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  i === currentIndex ? 'bg-primary-500 text-white' :
                  answers[q.id] ? (revealed[q.id]?.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                } ${flagged.has(q.id) ? 'ring-2 ring-yellow-400' : ''}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>⬜ Unanswered</span>
            <span>🟢 Correct</span>
            <span>🔴 Incorrect</span>
            <span>🟡 Flagged</span>
          </div>
        </div>
      )}

      {/* Question Card */}
      {currentQ && (
        <div className="card">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={getBennerBadgeClass(currentQ.bennerStage)}>
              {getBennerLabel(currentQ.bennerStage)}
            </span>
            <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {currentQ.category}
            </span>
            {currentQ.questionType === 'advanced' && (
              <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                🔬 Advanced
              </span>
            )}
            {currentQ.clinicalTopic && (
              <span className="badge bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                {getClinicalTopicLabel(currentQ.clinicalTopic)}
              </span>
            )}
          </div>

          <p className="text-lg font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">
            {currentQ.stem}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const selected = answers[currentQ.id] === opt;
              const result = revealed[currentQ.id];
              const isCorrect = result?.correctAnswer === opt;
              const isWrong = selected && !result?.isCorrect;

              let className = 'p-4 rounded-xl border-2 cursor-pointer transition-all text-left w-full ';
              if (result) {
                if (isCorrect) className += 'border-green-400 bg-green-50 dark:bg-green-900/20 ';
                else if (isWrong) className += 'border-red-400 bg-red-50 dark:bg-red-900/20 ';
                else className += 'border-gray-200 dark:border-gray-700 opacity-60 ';
              } else if (selected) {
                className += 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ';
              } else {
                className += 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 ';
              }

              return (
                <button key={opt} onClick={() => handleSelect(opt)} disabled={!!answers[currentQ.id]}
                  className={className}>
                  <span className="font-bold mr-3">{opt}.</span>
                  {currentQ[`option${opt}`]}
                  {result && isCorrect && <span className="float-right text-green-600 font-bold">✓</span>}
                  {result && isWrong && <span className="float-right text-red-600 font-bold">✗</span>}
                </button>
              );
            })}
          </div>

          {/* Rationale */}
          {revealed[currentQ.id] && (
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className={`p-4 rounded-xl ${
                revealed[currentQ.id].isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <h4 className={`font-bold mb-1 ${revealed[currentQ.id].isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {revealed[currentQ.id].isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{revealed[currentQ.id].rationale}</p>
              </div>
              {revealed[currentQ.id].examTip && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-1">💡 Exam Tip</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">{revealed[currentQ.id].examTip}</p>
                </div>
              )}
              {revealed[currentQ.id].bennerBreakdown && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">🎯 Benner Breakdown</h4>
                  <p className="text-sm text-indigo-800 dark:text-indigo-200">{revealed[currentQ.id].bennerBreakdown}</p>
                </div>
              )}
              {revealed[currentQ.id].pharmacologyFocus && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">💊 Pharmacology Focus</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {revealed[currentQ.id].pharmacologyFocus.split(',').map((tag, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                        {tag.trim().replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}
              className="btn-secondary disabled:opacity-50">
              ← Previous
            </button>
            <div className="flex gap-2">
              <button onClick={handleFlag}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  flagged.has(currentQ.id) ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                }`}>
                {flagged.has(currentQ.id) ? '🚩 Flagged' : '🏳️ Flag'}
              </button>
            </div>
            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex(i => i + 1)} className="btn-primary">
                Next →
              </button>
            ) : (
              <button onClick={handleFinish} disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50">
                {submitting ? 'Finishing...' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
