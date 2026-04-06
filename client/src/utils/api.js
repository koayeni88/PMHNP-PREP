const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('pmhnp_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, name) => request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  me: () => request('/auth/me'),

  // Questions
  getQuestions: (params) => request(`/questions?${new URLSearchParams(params)}`),
  getQuestion: (id) => request(`/questions/${id}`),
  getFilters: () => request('/questions/meta/filters'),
  getFacets: (params) => request(`/questions/meta/facets?${new URLSearchParams(params)}`),

  // Quiz
  createQuiz: (data) => request('/quiz/create', { method: 'POST', body: JSON.stringify(data) }),
  getQuizQuestions: (quizId) => request(`/quiz/${quizId}/questions`),
  submitAnswer: (attemptId, data) => request(`/quiz/${attemptId}/answer`, { method: 'POST', body: JSON.stringify(data) }),
  completeQuiz: (attemptId, data) => request(`/quiz/${attemptId}/complete`, { method: 'POST', body: JSON.stringify(data) }),
  getResults: (attemptId) => request(`/quiz/${attemptId}/results`),
  getHistory: () => request('/quiz/history/me'),

  // Analytics
  getDashboard: () => request('/analytics/dashboard'),
  getPassLikelihood: () => request('/analytics/pass-likelihood'),

  // Study Plans
  getStudyPlans: () => request('/studyplans'),
  createStudyPlan: (data) => request('/studyplans', { method: 'POST', body: JSON.stringify(data) }),
  getActiveStudyPlan: () => request('/studyplans/active'),
  logStudyProgress: (planId, data) => request(`/studyplans/${planId}/log`, { method: 'POST', body: JSON.stringify(data) }),
  deleteStudyPlan: (planId) => request(`/studyplans/${planId}`, { method: 'DELETE' }),

  // Bookmarks
  getBookmarks: () => request('/bookmarks'),
  toggleBookmark: (questionId) => request('/bookmarks/toggle', { method: 'POST', body: JSON.stringify({ questionId }) }),
  checkBookmark: (questionId) => request(`/bookmarks/check/${questionId}`),

  // Notes
  getNotes: () => request('/notes'),
  getNote: (questionId) => request(`/notes/question/${questionId}`),
  saveNote: (questionId, content) => request('/notes', { method: 'POST', body: JSON.stringify({ questionId, content }) }),
  deleteNote: (noteId) => request(`/notes/${noteId}`, { method: 'DELETE' }),

  // Admin
  adminStats: () => request('/admin/stats'),
  adminQuestions: (params) => request(`/admin/questions?${new URLSearchParams(params)}`),
  adminCreateQuestion: (data) => request('/admin/questions', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateQuestion: (id, data) => request(`/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteQuestion: (id) => request(`/admin/questions/${id}`, { method: 'DELETE' }),
  adminUsers: () => request('/admin/users'),
  adminUpdateUser: (id, data) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminMissedAnalytics: () => request('/admin/analytics/missed'),
};
