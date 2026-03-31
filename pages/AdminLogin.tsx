import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';
import { Lock, User, X } from 'lucide-react';

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("Please enter a username.");
      setIsLoading(false);
      return;
    }

    if (!passcode) {
      setError("Please enter a passcode.");
      setIsLoading(false);
      return;
    }

    try {
      // Verify credentials via server-side API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, passcode }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response from server:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        if (response.status === 401) setPasscode('');
        setIsLoading(false);
        return;
      }

      // Success
      localStorage.setItem('trh_admin_auth', 'true');
      localStorage.setItem(STORAGE_KEYS.USER, data.username); // Store the canonical name from server
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-sm border border-slate-700 relative">
        <button 
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
            title="Return to Home"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-3 rounded-full">
                <Lock className="w-6 h-6 text-white" />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Admin Access</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">Identify yourself to access the finance portal.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">USERNAME</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="Enter Your Name"
                    className="w-full pl-10 p-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
                    autoFocus
                />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">PASSCODE</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(''); }}
              placeholder="Enter Passcode"
              className="w-full text-center tracking-widest text-lg p-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center font-medium animate-pulse">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Unlock System'}
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-6">Secure Session Access</p>
      </div>
    </div>
  );
};

export default AdminLogin;