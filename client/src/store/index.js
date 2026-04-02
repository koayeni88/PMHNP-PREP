import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('pmhnp_token'),
  isAuthenticated: !!localStorage.getItem('pmhnp_token'),

  login: (user, token) => {
    localStorage.setItem('pmhnp_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('pmhnp_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user })
}));

export const useQuizStore = create((set) => ({
  currentQuiz: null,
  attemptId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  flagged: new Set(),
  startTime: null,
  timeLimit: null,

  startQuiz: (quiz, questions, attemptId) => set({
    currentQuiz: quiz,
    questions,
    attemptId,
    currentIndex: 0,
    answers: {},
    flagged: new Set(),
    startTime: Date.now(),
    timeLimit: quiz.timeLimit
  }),

  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),

  toggleFlag: (questionId) => set((state) => {
    const newFlagged = new Set(state.flagged);
    if (newFlagged.has(questionId)) newFlagged.delete(questionId);
    else newFlagged.add(questionId);
    return { flagged: newFlagged };
  }),

  goToQuestion: (index) => set({ currentIndex: index }),
  nextQuestion: () => set((state) => ({
    currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1)
  })),
  prevQuestion: () => set((state) => ({
    currentIndex: Math.max(state.currentIndex - 1, 0)
  })),

  reset: () => set({
    currentQuiz: null, attemptId: null, questions: [], currentIndex: 0,
    answers: {}, flagged: new Set(), startTime: null, timeLimit: null
  })
}));
