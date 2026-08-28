import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User, Phone, Eye, EyeOff, ShieldCheck, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    setCurrentPage,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (authModalTab === 'login') {
      const result = await login(email, password);
      setLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } else {
      if (password.length < 6) {
        setLoading(false);
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      const result = await register({
        email,
        password,
        name,
        phone,
      });
      setLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      }
    }
  };

  const handleQuickDirectorLogin = async () => {
    setEmail('admin@pranith.luxury');
    setPassword('AdminPassword2026!');
    setErrorMessage(null);
    setLoading(true);
    const result = await login('admin@pranith.luxury', 'AdminPassword2026!');
    setLoading(false);
    if (result.success) {
      setCurrentPage('admin');
    } else {
      setErrorMessage(result.error || 'Failed to authenticate admin account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display-luxury text-xl sm:text-2xl font-bold tracking-wide text-white">
            {authModalTab === 'login' ? 'Boutique Client & Staff Access' : 'Create VIP Client Account'}
          </h2>
          <p className="text-xs text-stone-400">
            {authModalTab === 'login'
              ? 'Sign in to access your luxury orders or administrative suite.'
              : 'Register for personalized concierge, bespoke pearl consultations, and order history.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              authModalTab === 'login'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              authModalTab === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
            <span className="font-bold">Error:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Princess Monineath"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 pl-10 text-sm text-stone-100 placeholder-stone-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Telegram / Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +855 12 888 999 or @username"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 pl-10 text-sm text-stone-100 placeholder-stone-600 outline-none transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxury.com"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 pl-10 text-sm text-stone-100 placeholder-stone-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-2.5 pl-10 pr-10 text-sm text-stone-100 placeholder-stone-600 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authModalTab === 'register' && (
              <p className="text-[11px] text-stone-500 mt-1">Must be at least 6 characters.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{authModalTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Admin Access Hint */}
        {authModalTab === 'login' && (
          <div className="mt-6 pt-4 border-t border-stone-800/80 space-y-2">
            <div className="text-[11px] text-stone-400 text-center">
              Demonstration & Management Account:
            </div>
            <button
              type="button"
              onClick={handleQuickDirectorLogin}
              disabled={loading}
              className="w-full py-2 bg-stone-800/90 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Super Admin Login (Director)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
