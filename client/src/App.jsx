import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/index.js';
import { useEffect } from 'react';
import { api } from './utils/api.js';
import Navbar from './components/common/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionBank from './pages/QuestionBank.jsx';
import QuizBuilder from './pages/QuizBuilder.jsx';
import ActiveQuiz from './pages/ActiveQuiz.jsx';
import QuizResults from './pages/QuizResults.jsx';
import Analytics from './pages/Analytics.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import BennerStudy from './pages/BennerStudy.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminQuestions from './pages/AdminQuestions.jsx';
import StudyPlan from './pages/StudyPlan.jsx';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  const { isAuthenticated, setUser, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      api.me().then(setUser).catch(() => useAuthStore.getState().logout());
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><QuestionBank /></ProtectedRoute>} />
          <Route path="/quiz/builder" element={<ProtectedRoute><QuizBuilder /></ProtectedRoute>} />
          <Route path="/quiz/:attemptId" element={<ProtectedRoute><ActiveQuiz /></ProtectedRoute>} />
          <Route path="/quiz/:attemptId/results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/study-plan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
          <Route path="/study/benner/:stage" element={<ProtectedRoute><BennerStudy /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/questions" element={<ProtectedRoute adminOnly><AdminQuestions /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
