import { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { getBennerBadgeClass, getBennerLabel } from '../utils/constants.js';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tab, setTab] = useState('bookmarks');
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingExistingNote, setEditingExistingNote] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    Promise.all([api.getBookmarks(), api.getNotes()])
      .then(([bm, nt]) => { setBookmarks(bm); setNotes(nt); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper: get note for a question
  const getNoteForQuestion = (questionId) => notes.find(n => n.questionId === questionId);

  const removeBookmark = async (questionId) => {
    try {
      await api.toggleBookmark(questionId);
      setBookmarks(bm => bm.filter(b => b.question.id !== questionId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const startEditNote = (questionId) => {
    const existing = getNoteForQuestion(questionId);
    setEditingNote(questionId);
    setNoteContent(existing ? existing.content : '');
  };

  const saveNote = async (questionId) => {
    if (!noteContent.trim()) return;
    setSaving(true);
    try {
      await api.saveNote(questionId, noteContent);
      setEditingNote(null);
      setNoteContent('');
      const updated = await api.getNotes();
      setNotes(updated);
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSaving(false);
    }
  };

  const startEditExistingNote = (note) => {
    setEditingExistingNote(note.id);
    setEditContent(note.content);
  };

  const saveExistingNote = async (questionId, noteId) => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await api.saveNote(questionId, editContent);
      setEditingExistingNote(null);
      setEditContent('');
      const updated = await api.getNotes();
      setNotes(updated);
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await api.deleteNote(noteId);
      setNotes(n => n.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🔖 Bookmarks & Notes</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Your saved questions and personal study notes</p>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('bookmarks')}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            tab === 'bookmarks' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
          Bookmarks ({bookmarks.length})
        </button>
        <button onClick={() => setTab('notes')}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            tab === 'notes' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
          Notes ({notes.length})
        </button>
      </div>

      {tab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              No bookmarks yet. Bookmark questions while studying to see them here.
            </div>
          ) : bookmarks.map((b) => (
            <div key={b.id} className="card">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={getBennerBadgeClass(b.question.bennerStage)}>
                  {getBennerLabel(b.question.bennerStage)}
                </span>
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {b.question.category}
                </span>
              </div>
              <p className="text-gray-900 dark:text-white font-medium text-sm">{b.question.stem}</p>

              {/* Show existing note inline */}
              {getNoteForQuestion(b.question.id) && editingNote !== b.question.id && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">📝 Your Note</span>
                    <span className="text-xs text-gray-400">
                      {new Date(getNoteForQuestion(b.question.id).updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap">{getNoteForQuestion(b.question.id).content}</p>
                </div>
              )}

              <div className="flex gap-3 mt-3">
                <button onClick={() => removeBookmark(b.question.id)}
                  className="text-xs text-red-500 hover:text-red-600">Remove Bookmark</button>
                <button onClick={() => startEditNote(b.question.id)}
                  className="text-xs text-primary-600 hover:text-primary-700">
                  {getNoteForQuestion(b.question.id) ? 'Edit Note' : 'Add Note'}
                </button>
                {getNoteForQuestion(b.question.id) && (
                  <button onClick={() => deleteNote(getNoteForQuestion(b.question.id).id)}
                    className="text-xs text-red-400 hover:text-red-500">Delete Note</button>
                )}
              </div>
              {editingNote === b.question.id && (
                <div className="mt-3 space-y-2">
                  <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                    className="input-field min-h-[6rem] text-sm resize-y w-full break-words whitespace-pre-wrap" placeholder="Write your study note..." />
                  <div className="flex gap-2">
                    <button onClick={() => saveNote(b.question.id)} disabled={saving || !noteContent.trim()}
                      className="btn-primary text-sm !py-2 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingNote(null)} className="btn-secondary text-sm !py-2">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              No notes yet. Add notes to questions while studying.
            </div>
          ) : notes.map((n) => (
            <div key={n.id} className="card">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={getBennerBadgeClass(n.question.bennerStage)}>
                  {getBennerLabel(n.question.bennerStage)}
                </span>
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {n.question.category}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{n.question.stem}</p>
              {editingExistingNote === n.id ? (
                <div className="space-y-2">
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                    className="input-field min-h-[6rem] text-sm resize-y w-full break-words whitespace-pre-wrap" placeholder="Edit your note..." />
                  <div className="flex gap-2">
                    <button onClick={() => saveExistingNote(n.questionId, n.id)} disabled={saving || !editContent.trim()}
                      className="btn-primary text-sm !py-2 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingExistingNote(null)} className="btn-secondary text-sm !py-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl overflow-hidden">
                  <p className="text-sm text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap">{n.content}</p>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-gray-400">
                  Updated {new Date(n.updatedAt).toLocaleDateString()}
                </span>
                <button onClick={() => startEditExistingNote(n)}
                  className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
                <button onClick={() => deleteNote(n.id)}
                  className="text-xs text-red-500 hover:text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
