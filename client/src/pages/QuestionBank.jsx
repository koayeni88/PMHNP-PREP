import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { getBennerBadgeClass, getBennerLabel, getClinicalTopicLabel, CLINICAL_TOPICS, BODY_SYSTEMS, getBodySystemForTopic } from '../utils/constants.js';

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', bennerStage: '', difficulty: '', search: '', questionType: '', bodySystem: '', answerStatus: '' });
  const [selectedClinicalTopics, setSelectedClinicalTopics] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    api.getFilters().then(setFilterOptions).catch(console.error);
    api.getBookmarks().then(bms => setBookmarkedIds(new Set(bms.map(b => b.question.id)))).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (filters.category) params.category = filters.category;
    if (filters.bennerStage) params.bennerStage = filters.bennerStage;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.questionType) params.questionType = filters.questionType;
    if (filters.bodySystem) {
      const system = BODY_SYSTEMS.find(s => s.key === filters.bodySystem);
      if (system) {
        // Combine body system topics with directly selected topics
        const combined = new Set(system.clinicalTopics);
        selectedClinicalTopics.forEach(t => combined.add(t));
        params.clinicalTopic = [...combined].join(',');
      }
    } else if (selectedClinicalTopics.length > 0) {
      params.clinicalTopic = selectedClinicalTopics.join(',');
    }
    if (filters.search) params.search = filters.search;
    if (filters.answerStatus) params.answerStatus = filters.answerStatus;

    api.getQuestions(params)
      .then((data) => { setQuestions(data.questions); setTotal(data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, filters, selectedClinicalTopics]);

  const handleBookmark = async (questionId) => {
    await api.toggleBookmark(questionId);
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Question Bank</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{total} questions available</p>
      </div>

      {/* Body System Filter */}
      <div className="card mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filter by Body System</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setFilters(f => ({ ...f, bodySystem: '', clinicalTopic: '' })); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              !filters.bodySystem
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            All Systems
          </button>
          {BODY_SYSTEMS.map((system) => (
            <button key={system.key}
              onClick={() => { setFilters(f => ({ ...f, bodySystem: system.key, clinicalTopic: '' })); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.bodySystem === system.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {system.icon} {system.label}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Status Filter */}
      <div className="card mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filter by Answer Status</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: '', label: 'All Questions', icon: '📋' },
            { key: 'answered', label: 'Answered Correctly', icon: '✅' },
            { key: 'failed', label: 'Answered Incorrectly', icon: '❌' },
            { key: 'unattempted', label: 'Not Attempted', icon: '⬜' },
          ].map((opt) => (
            <button key={opt.key}
              onClick={() => { setFilters(f => ({ ...f, answerStatus: opt.key })); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.answerStatus === opt.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <input type="text" placeholder="Search questions..."
            className="input-field"
            value={filters.search}
            onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
          />
          <select className="input-field" value={filters.category}
            onChange={(e) => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}>
            <option value="">All Categories</option>
            {filterOptions?.categories?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input-field" value={filters.bennerStage}
            onChange={(e) => { setFilters(f => ({ ...f, bennerStage: e.target.value })); setPage(1); }}>
            <option value="">All Benner Stages</option>
            {filterOptions?.bennerStages?.map(s => <option key={s} value={s}>{getBennerLabel(s)}</option>)}
          </select>
          <select className="input-field" value={filters.difficulty}
            onChange={(e) => { setFilters(f => ({ ...f, difficulty: e.target.value })); setPage(1); }}>
            <option value="">All Difficulties</option>
            {filterOptions?.difficulties?.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select className="input-field" value={filters.questionType}
            onChange={(e) => { setFilters(f => ({ ...f, questionType: e.target.value })); setPage(1); }}>
            <option value="">All Types</option>
            {filterOptions?.questionTypes?.map(t => <option key={t} value={t}>{t === 'advanced' ? '🔬 Advanced' : 'Standard'}</option>)}
          </select>
          <button onClick={() => { setFilters({ category: '', bennerStage: '', difficulty: '', search: '', questionType: '', bodySystem: '', answerStatus: '' }); setSelectedClinicalTopics([]); setPage(1); }}
            className="btn-secondary text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Clinical Topics — multi-select */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Clinical Topics {selectedClinicalTopics.length > 0 && <span className="text-primary-600">({selectedClinicalTopics.length} selected)</span>}
          </h3>
          <div className="flex items-center gap-3">
            {selectedClinicalTopics.length > 0 && (
              <button onClick={() => { setSelectedClinicalTopics([]); setPage(1); }} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Clear Topics
              </button>
            )}
            <button onClick={() => setShowAllTopics(prev => !prev)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
              {showAllTopics ? 'Show Less' : 'Show All'}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(showAllTopics ? CLINICAL_TOPICS : CLINICAL_TOPICS.slice(0, 12)).map((t) => {
            const isSelected = selectedClinicalTopics.includes(t.key);
            return (
              <button key={t.key}
                onClick={() => {
                  setSelectedClinicalTopics(prev =>
                    prev.includes(t.key) ? prev.filter(k => k !== t.key) : [...prev, t.key]
                  );
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}>
                {t.icon} {t.label} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" /></div>
      ) : questions.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">No questions match your filters</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={getBennerBadgeClass(q.bennerStage)}>{getBennerLabel(q.bennerStage)}</span>
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{q.category}</span>
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{q.subtopic}</span>
                <span className={`badge ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {q.difficulty}
                </span>
                {q.questionType === 'advanced' && (
                  <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">🔬 Advanced</span>
                )}
                {q.clinicalTopic && (
                  <span className="badge bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">{getClinicalTopicLabel(q.clinicalTopic)}</span>
                )}
                {q.clinicalTopic && getBodySystemForTopic(q.clinicalTopic) && (
                  <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {getBodySystemForTopic(q.clinicalTopic).icon} {getBodySystemForTopic(q.clinicalTopic).label}
                  </span>
                )}
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-3">{q.stem}</p>
              
              <div className="flex gap-2">
                <button onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  {expanded === q.id ? 'Hide Details' : 'Show Answer & Rationale'}
                </button>
                <button onClick={() => handleBookmark(q.id)}
                  className={`text-sm transition-colors ${bookmarkedIds.has(q.id) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}>
                  {bookmarkedIds.has(q.id) ? '🔖 Bookmarked' : '🔖 Bookmark'}
                </button>
              </div>

              {expanded === q.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <div key={opt} className={`p-3 rounded-xl text-sm ${
                        q.correctAnswer === opt 
                          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700' 
                          : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                      }`}>
                        <span className="font-bold mr-2">{opt}.</span>
                        {q[`option${opt}`]}
                        {q.correctAnswer === opt && <span className="ml-2 text-green-600">✓</span>}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-1">Rationale</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{q.rationale}</p>
                  </div>
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    q[`explanation${opt}`] && (
                      <div key={opt} className="text-sm">
                        <span className="font-semibold">{opt}: </span>
                        <span className="text-gray-600 dark:text-gray-400">{q[`explanation${opt}`]}</span>
                      </div>
                    )
                  ))}
                  {q.examTip && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                      <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-1">💡 Exam Tip</h4>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{q.examTip}</p>
                    </div>
                  )}
                  {q.bennerBreakdown && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">🎯 Benner Breakdown</h4>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200">{q.bennerBreakdown}</p>
                    </div>
                  )}
                  {q.pharmacologyFocus && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                      {q.pharmacologyFocus.includes('moa') && (
                        <div className="mb-3 p-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-lg border-l-4 border-blue-500">
                          <h5 className="font-bold text-blue-700 dark:text-blue-300 mb-1">⚗️ KEY MOA FOCUS</h5>
                          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed italic">This question emphasizes medication mechanism of action</p>
                        </div>
                      )}
                      <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">💊 Pharmacology Focus</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {q.pharmacologyFocus.split(',').map((tag, i) => {
                          const cleanTag = tag.trim().replace(/_/g, ' ');
                          const isMOA = tag.trim() === 'moa';
                          return (
                            <span 
                              key={i} 
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                isMOA 
                                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg' 
                                  : 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {isMOA ? '⚡ ' : ''}{cleanTag.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 italic">Reasoning objective: {q.clinicalReasoningObj}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-secondary disabled:opacity-50">Previous</button>
          <span className="px-4 py-2 text-gray-500">Page {page} of {Math.ceil(total / 10)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)}
            className="btn-secondary disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
