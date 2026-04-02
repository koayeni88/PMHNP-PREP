import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { BENNER_STAGES, CATEGORIES, QUESTION_TYPES, CLINICAL_TOPICS, PHARMACOLOGY_FOCUSES, getBennerLabel, getClinicalTopicLabel } from '../utils/constants.js';

const emptyQuestion = {
  stem: '', optionA: '', optionB: '', optionC: '', optionD: '',
  correctAnswer: 'A', rationale: '', explanationA: '', explanationB: '',
  explanationC: '', explanationD: '', examTip: '', category: 'Pathophysiology',
  subtopic: '', difficulty: 'medium', bennerStage: 'novice', clinicalReasoningObj: '',
  questionType: 'standard', clinicalTopic: '', pharmacologyFocus: '', bennerBreakdown: ''
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // question object or 'new'
  const [form, setForm] = useState(emptyQuestion);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.adminQuestions({ page, limit: 20 })
      .then(d => { setQuestions(d.questions); setTotal(d.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleEdit = (q) => {
    setEditing(q.id);
    setForm({ ...q });
  };

  const handleNew = () => {
    setEditing('new');
    setForm({ ...emptyQuestion });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.adminCreateQuestion(form);
      } else {
        const { id, createdAt, updatedAt, isActive, ...data } = form;
        await api.adminUpdateQuestion(editing, data);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this question?')) return;
    await api.adminDeleteQuestion(id);
    load();
  };

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Question Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{total} total questions</p>
        </div>
        <button onClick={handleNew} className="btn-primary">+ New Question</button>
      </div>

      {/* Editor Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editing === 'new' ? 'Create Question' : 'Edit Question'}
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Stem</label>
                <textarea value={form.stem} onChange={e => updateForm('stem', e.target.value)}
                  className="input-field h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div key={opt}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Option {opt}</label>
                    <input value={form[`option${opt}`]} onChange={e => updateForm(`option${opt}`, e.target.value)}
                      className="input-field" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Answer</label>
                  <select value={form.correctAnswer} onChange={e => updateForm('correctAnswer', e.target.value)} className="input-field">
                    {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={form.category} onChange={e => updateForm('category', e.target.value)} className="input-field">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benner Stage</label>
                  <select value={form.bennerStage} onChange={e => updateForm('bennerStage', e.target.value)} className="input-field">
                    {BENNER_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtopic</label>
                  <input value={form.subtopic} onChange={e => updateForm('subtopic', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select value={form.difficulty} onChange={e => updateForm('difficulty', e.target.value)} className="input-field">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rationale</label>
                <textarea value={form.rationale} onChange={e => updateForm('rationale', e.target.value)} className="input-field h-20" />
              </div>
              {['A', 'B', 'C', 'D'].map(opt => (
                <div key={opt}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation {opt}</label>
                  <textarea value={form[`explanation${opt}`]} onChange={e => updateForm(`explanation${opt}`, e.target.value)} className="input-field h-16" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Tip</label>
                <textarea value={form.examTip} onChange={e => updateForm('examTip', e.target.value)} className="input-field h-16" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clinical Reasoning Objective</label>
                <input value={form.clinicalReasoningObj} onChange={e => updateForm('clinicalReasoningObj', e.target.value)} className="input-field" />
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔬 Advanced Question Fields</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Type</label>
                    <select value={form.questionType} onChange={e => updateForm('questionType', e.target.value)} className="input-field">
                      {QUESTION_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clinical Topic</label>
                    <select value={form.clinicalTopic} onChange={e => updateForm('clinicalTopic', e.target.value)} className="input-field">
                      <option value="">None</option>
                      {CLINICAL_TOPICS.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pharmacology Focus (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {PHARMACOLOGY_FOCUSES.map(pf => {
                      const tags = (form.pharmacologyFocus || '').split(',').map(t => t.trim()).filter(Boolean);
                      const isSelected = tags.includes(pf.key);
                      return (
                        <button key={pf.key} type="button"
                          onClick={() => {
                            const next = isSelected ? tags.filter(t => t !== pf.key) : [...tags, pf.key];
                            updateForm('pharmacologyFocus', next.join(','));
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                            isSelected ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-800/40 dark:text-emerald-300 dark:border-emerald-600' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                          }`}>
                          {isSelected ? '✓ ' : ''}{pf.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benner Breakdown</label>
                  <textarea value={form.bennerBreakdown} onChange={e => updateForm('bennerBreakdown', e.target.value)} className="input-field h-20" placeholder="Explain how this question maps to the Benner clinical reasoning stage..." />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Question'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-medium text-gray-500">Stem</th>
                <th className="text-left p-3 font-medium text-gray-500">Type</th>
                <th className="text-left p-3 font-medium text-gray-500">Category</th>
                <th className="text-left p-3 font-medium text-gray-500">Topic</th>
                <th className="text-left p-3 font-medium text-gray-500">Stage</th>
                <th className="text-left p-3 font-medium text-gray-500">Difficulty</th>
                <th className="text-left p-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 max-w-md">
                    <p className="truncate text-gray-900 dark:text-white">{q.stem}</p>
                    <p className="text-xs text-gray-400">{q.subtopic}</p>
                  </td>
                  <td className="p-3">
                    {q.questionType === 'advanced' ? (
                      <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">🔬 Adv</span>
                    ) : (
                      <span className="text-xs text-gray-400">Std</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{q.category}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400 text-xs">
                    {q.clinicalTopic ? getClinicalTopicLabel(q.clinicalTopic) : '—'}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{getBennerLabel(q.bennerStage)}</td>
                  <td className="p-3">
                    <span className={`badge ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(q)} className="text-primary-600 hover:text-primary-700 font-medium">Edit</button>
                      <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-secondary disabled:opacity-50">Previous</button>
          <span className="px-4 py-2 text-gray-500">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
            className="btn-secondary disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
