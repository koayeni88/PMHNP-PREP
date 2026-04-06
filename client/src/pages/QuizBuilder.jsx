import { useState, useMemo, useEffect } from 'react';
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
  const [selectedBodySystems, setSelectedBodySystems] = useState([]);
  const [selectedClinicalTopics, setSelectedClinicalTopics] = useState([]);
  const [questionCount, setQuestionCount] = useState(isExam ? 150 : 20);
  const [timed, setTimed] = useState(isExam);
  const [timeLimit, setTimeLimit] = useState(isExam ? 210 : 30); // minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [facets, setFacets] = useState(null);

  // Topics implied by selected body systems
  const bodySystemTopics = useMemo(() => {
    const topics = new Set();
    selectedBodySystems.forEach(sysKey => {
      const sys = BODY_SYSTEMS.find(s => s.key === sysKey);
      if (sys) sys.clinicalTopics.forEach(t => topics.add(t));
    });
    return topics;
  }, [selectedBodySystems]);

  // Combined: body-system-implied topics + individually selected topics
  const allSelectedTopics = useMemo(() => {
    const combined = new Set(bodySystemTopics);
    selectedClinicalTopics.forEach(t => combined.add(t));
    return combined;
  }, [bodySystemTopics, selectedClinicalTopics]);

  // Stable string for useEffect dependency
  const topicsParam = useMemo(() => [...allSelectedTopics].sort().join(','), [allSelectedTopics]);

  // Fetch faceted counts whenever filters change
  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (bennerStage) params.bennerStage = bennerStage;
    if (questionType) params.questionType = questionType;
    if (topicsParam) params.clinicalTopic = topicsParam;
    api.getFacets(params).then(setFacets).catch(() => {});
  }, [category, bennerStage, questionType, topicsParam]);

  // Derive body system counts from clinical topic facets
  const bodySystemCounts = useMemo(() => {
    if (!facets) return {};
    const counts = {};
    BODY_SYSTEMS.forEach(sys => {
      counts[sys.key] = sys.clinicalTopics.reduce((sum, t) => sum + (facets.clinicalTopics[t] || 0), 0);
    });
    return counts;
  }, [facets]);

  const toggleBodySystem = (key) => {
    setSelectedBodySystems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleClinicalTopic = (key) => {
    // If topic is implied by a body system, toggling removes the whole system instead
    if (bodySystemTopics.has(key) && !selectedClinicalTopics.includes(key)) return;
    setSelectedClinicalTopics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const clearAllSelections = () => {
    setSelectedBodySystems([]);
    setSelectedClinicalTopics([]);
  };

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const topicsList = [...allSelectedTopics];
      const data = await api.createQuiz({
        mode,
        category: category || undefined,
        bennerStage: bennerStage || undefined,
        questionType: questionType || undefined,
        clinicalTopic: topicsList.length > 0 ? topicsList.join(',') : undefined,
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
                {CATEGORIES.map((c) => {
                  const count = facets?.categories?.[c.key] ?? null;
                  const disabled = count === 0;
                  return (
                    <button key={c.key} onClick={() => !disabled && setCategory(c.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                        category === c.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : disabled ? 'border-gray-200 dark:border-gray-700 opacity-30 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700'}`}>
                      <span>{c.icon} {c.label.split(' ')[0]}</span>
                      {count !== null && <span className="block text-[10px] text-gray-400 mt-0.5">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body System — multi-select */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body Systems</label>
                {selectedBodySystems.length > 0 && (
                  <button onClick={clearAllSelections} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BODY_SYSTEMS.map((s) => {
                  const isSelected = selectedBodySystems.includes(s.key);
                  const count = bodySystemCounts[s.key] ?? null;
                  const disabled = count === 0 && !isSelected;
                  return (
                    <button key={s.key} onClick={() => !disabled && toggleBodySystem(s.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-300'
                          : disabled ? 'border-gray-200 dark:border-gray-700 opacity-30 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                      <span>{s.icon} {s.label}</span>
                      {count !== null && <span className="ml-1 text-[10px] text-gray-400">({count})</span>}
                      {isSelected && <span className="ml-1 text-primary-600">✓</span>}
                    </button>
                  );
                })}
              </div>
              {selectedBodySystems.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {selectedBodySystems.length} system{selectedBodySystems.length > 1 ? 's' : ''} selected — {allSelectedTopics.size} topic{allSelectedTopics.size !== 1 ? 's' : ''} included
                </p>
              )}
            </div>

            {/* Clinical Topics — multi-select, always visible */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Clinical Topics</label>
                {selectedClinicalTopics.length > 0 && (
                  <button onClick={() => setSelectedClinicalTopics([])} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    Clear Topics
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLINICAL_TOPICS.map((t) => {
                  const fromSystem = bodySystemTopics.has(t.key);
                  const directlySelected = selectedClinicalTopics.includes(t.key);
                  const isActive = fromSystem || directlySelected;
                  const count = facets?.clinicalTopics?.[t.key] ?? null;
                  const disabled = count === 0 && !isActive;
                  return (
                    <button key={t.key} onClick={() => !disabled && toggleClinicalTopic(t.key)}
                      className={`px-3 py-2 rounded-lg border text-left transition-all text-xs ${
                        fromSystem
                          ? 'border-primary-300 bg-primary-50/60 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 cursor-default'
                          : directlySelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-300'
                            : disabled ? 'border-gray-200 dark:border-gray-700 opacity-30 cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'}`}>
                      <span>{t.icon} {t.label}</span>
                      {count !== null && <span className="ml-1 text-[10px] text-gray-400">({count})</span>}
                      {isActive && <span className="ml-1 text-primary-500 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
              {allSelectedTopics.size > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {allSelectedTopics.size} total topic{allSelectedTopics.size !== 1 ? 's' : ''} will be queried
                </p>
              )}
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
                {BENNER_STAGES.map((s) => {
                  const count = facets?.bennerStages?.[s.key] ?? null;
                  const disabled = count === 0;
                  return (
                    <button key={s.key} onClick={() => !disabled && setBennerStage(s.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                        bennerStage === s.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : disabled ? 'border-gray-200 dark:border-gray-700 opacity-30 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700'}`}>
                      <span>{s.label}</span>
                      {count !== null && <span className="block text-[10px] text-gray-400 mt-0.5">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setQuestionType('')}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    !questionType ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  All Types
                </button>
                {QUESTION_TYPES.map((t) => {
                  const count = facets?.questionTypes?.[t.key] ?? null;
                  const disabled = count === 0;
                  return (
                    <button key={t.key} onClick={() => !disabled && setQuestionType(t.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                        questionType === t.key ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : disabled ? 'border-gray-200 dark:border-gray-700 opacity-30 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700'}`}>
                      <span>{t.key === 'advanced' ? '🔬 ' : ''}{t.label}</span>
                      {count !== null && <span className="block text-[10px] text-gray-400 mt-0.5">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

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

        {facets && (
          <div className={`p-3 rounded-xl text-center text-sm font-medium ${
            facets.total === 0
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
          }`}>
            {facets.total === 0
              ? 'No questions match your filters'
              : `${facets.total} question${facets.total !== 1 ? 's' : ''} available`}
          </div>
        )}

        <button onClick={handleStart} disabled={loading || (facets && facets.total === 0)}
          className="btn-primary w-full text-lg disabled:opacity-50">
          {loading ? 'Creating Quiz...' : isExam ? 'Start Mock Exam' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}
