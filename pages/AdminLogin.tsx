import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PASSCODE, STORAGE_KEYS, ALLOWED_USERS } from '../constants';
import { Lock, User, X } from 'lucide-react';

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check Passcode first
    if (passcode !== ADMIN_PASSCODE) {
      setError('Incorrect passcode. Try again.');
      setPasscode('');
      return;
    }

    const trimmedInput = username.trim();
    if (!trimmedInput) {
      setError("Please enter a username.");
      return;
    }

    // Check against allowed users (Case-insensitive)
    const matchedUser = ALLOWED_USERS.find(u => u.toLowerCase() === trimmedInput.toLowerCase());

    if (!matchedUser) {
      setError("Login not authorised.");
      return;
    }

    // Success
    localStorage.setItem('trh_admin_auth', 'true');
    localStorage.setItem(STORAGE_KEYS.USER, matchedUser); // Store the canonical name
    navigate('/admin/dashboard');
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
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Unlock System
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-6">Secure Session Access</p>
      </div>
    </div>
  );
};

export default AdminLogin;