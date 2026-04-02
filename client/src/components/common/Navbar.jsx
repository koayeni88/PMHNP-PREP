import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/index.js';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">PMHNP Prep</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/questions">Questions</NavLink>
              <NavLink to="/quiz/builder">Quiz</NavLink>
              <NavLink to="/analytics">Analytics</NavLink>
              <NavLink to="/study-plan">Study Plan</NavLink>
              <NavLink to="/bookmarks">Bookmarks</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" accent>Admin</NavLink>}
              <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user?.name}</span>
                <button onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, accent }) {
  return (
    <Link to={to}
      className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors
        ${accent
          ? 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
      {children}
    </Link>
  );
}
