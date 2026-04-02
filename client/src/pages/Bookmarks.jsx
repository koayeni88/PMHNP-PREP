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

  useEffect(() => {
    Promise.all([api.getBookmarks(), api.getNotes()])
      .then(([bm, nt]) => { setBookmarks(bm); setNotes(nt); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (questionId) => {
    await api.toggleBookmark(questionId);
    setBookmarks(bm => bm.filter(b => b.question.id !== questionId));
  };

  const saveNote = async (questionId) => {
    await api.saveNote(questionId, noteContent);
    setEditingNote(null);
    setNoteContent('');
    const updated = await api.getNotes();
    setNotes(updated);
  };

  const deleteNote = async (noteId) => {
    await api.deleteNote(noteId);
    setNotes(n => n.filter(note => note.id !== noteId));
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
              <div className="flex gap-3 mt-3">
                <button onClick={() => removeBookmark(b.question.id)}
                  className="text-xs text-red-500 hover:text-red-600">Remove Bookmark</button>
                <button onClick={() => { setEditingNote(b.question.id); setNoteContent(''); }}
                  className="text-xs text-primary-600 hover:text-primary-700">Add Note</button>
              </div>
              {editingNote === b.question.id && (
                <div className="mt-3 space-y-2">
                  <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                    className="input-field h-24 text-sm" placeholder="Write your study note..." />
                  <div className="flex gap-2">
                    <button onClick={() => saveNote(b.question.id)} className="btn-primary text-sm !py-2">Save</button>
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
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <p className="text-sm text-gray-800 dark:text-gray-200">{n.content}</p>
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-gray-400">
                  Updated {new Date(n.updatedAt).toLocaleDateString()}
                </span>
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
