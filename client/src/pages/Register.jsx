import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';
import { useAuthStore } from '../store/index.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await api.register(email, password, name);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Begin your clinical reasoning journey</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-field" placeholder="Jane Smith, PMHNP-BC" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field" placeholder="At least 8 characters" required minLength={8} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
