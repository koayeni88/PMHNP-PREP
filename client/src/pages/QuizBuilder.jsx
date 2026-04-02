import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api.js';
import { BENNER_STAGES, CATEGORIES, QUESTION_TYPES, CLINICAL_TOPICS, BODY_SYSTEMS, getBennerLabel } from '../utils/constants.js';

export default function QuizBuilder() {
  const [searchParams] = useSearchParams();
  const isExam = searchParams.get('mode') === 'exam';
  const navigate = useNavigate();

  const [mode, setMode] = useState(isExam ? 'exam' : 'practice');
  const [category, setCategory] = useState('');
  const [bennerStage, setBennerStage] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [clinicalTopic, setClinicalTopic] = useState('');
  const [bodySystem, setBodySystem] = useState('');
  const [questionCount, setQuestionCount] = useState(isExam ? 150 : 20);
  const [timed, setTimed] = useState(isExam);
  const [timeLimit, setTimeLimit] = useState(isExam ? 210 : 30); // minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const resolvedClinicalTopic = bodySystem
        ? BODY_SYSTEMS.find(s => s.key === bodySystem)?.clinicalTopics.join(',')
        : clinicalTopic || undefined;
      const data = await api.createQuiz({
        mode,
        category: category || undefined,
        bennerStage: bennerStage || undefined,
        questionType: questionType || undefined,
        clinicalTopic: resolvedClinicalTopic,
        questionCount: parseInt(questionCount),
        timeLimit: timed ? timeLimit * 60 : undefined
      });
      navigate(`/quiz/${data.attemptId}?quizId=${data.quizId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isExam ? '📝 Mock Exam Setup' : '🎯 Custom Quiz Builder'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isExam ? 'Simulate the actual PMHNP certification exam' : 'Build a targeted practice quiz'}
        </p>
      </div>

      <div className="card space-y-6">
        {!isExam && (
          <>
            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quiz Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'practice', label: 'Practice', desc: 'Untimed, see answers' },
                  { value: 'timed', label: 'Timed', desc: 'With time limit' },
                  { value: 'exam', label: 'Exam', desc: 'Full simulation' }
                ].map((m) => (
                  <button key={m.value}
                    onClick={() => {
                      setMode(m.value);
                      setTimed(m.value !== 'practice');
                      if (m.value === 'exam') { setQuestionCount(150); setTimeLimit(210); }
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      mode === m.value 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={() => setCategory('')}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    !category ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button key={c.key} onClick={() => setCategory(c.key)}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                      category === c.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    {c.icon} {c.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Body System */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body System</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button onClick={() => { setBodySystem(''); setClinicalTopic(''); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    !bodySystem ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  All Systems
                </button>
                {BODY_SYSTEMS.map((s) => (
                  <button key={s.key} onClick={() => { setBodySystem(s.key); setClinicalTopic(''); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                      bodySystem === s.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Benner Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benner Stage</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button onClick={() => setBennerStage('')}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    !bennerStage ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  All Stages
                </button>
                {BENNER_STAGES.map((s) => (
                  <button key={s.key} onClick={() => setBennerStage(s.key)}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                      bennerStage === s.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => { setQuestionType(''); setClinicalTopic(''); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    !questionType ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  All Types
                </button>
                {QUESTION_TYPES.map((t) => (
                  <button key={t.key} onClick={() => { setQuestionType(t.key); if (t.key !== 'advanced') setClinicalTopic(''); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                      questionType === t.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    {t.key === 'advanced' ? '🔬 ' : ''}{t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Topic (visible when Advanced selected) */}
            {questionType === 'advanced' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clinical Topic</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button onClick={() => setClinicalTopic('')}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                      !clinicalTopic ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    All Topics
                  </button>
                  {CLINICAL_TOPICS.map((t) => (
                    <button key={t.key} onClick={() => setClinicalTopic(t.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                        clinicalTopic === t.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions: {questionCount}
              </label>
              <input type="range" min="5" max="150" value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full accent-primary-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span><span>50</span><span>100</span><span>150</span>
              </div>
            </div>
          </>
        )}

        {/* Time Limit */}
        {(timed || isExam) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Limit: {timeLimit} minutes
            </label>
            {!isExam && (
              <input type="range" min="5" max="240" value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full accent-primary-600" />
            )}
            {isExam && <p className="text-sm text-gray-500">3 hours 30 minutes — matches real exam conditions</p>}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <button onClick={handleStart} disabled={loading}
          className="btn-primary w-full text-lg disabled:opacity-50">
          {loading ? 'Creating Quiz...' : isExam ? 'Start Mock Exam' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
