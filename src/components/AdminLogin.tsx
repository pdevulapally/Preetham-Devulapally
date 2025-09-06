'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Eye, EyeOff, Lock, Mail, ArrowRight, LogOut } from 'lucide-react';
import { personal } from '../data/cv';

interface AdminLoginProps {
  onLogin: (user: any) => void;
  user: any;
}

export function AdminLogin({ onLogin, user }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogin(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            You are logged in as: {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 text-white hover:opacity-90 transition-opacity"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">
              {personal.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent mb-2">
            Admin Login
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Access your portfolio dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            {personal.name} Portfolio Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
