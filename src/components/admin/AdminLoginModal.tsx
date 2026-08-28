import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Mail, Lock, Sparkles, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { login, setCurrentPage } = useStore();
  const [email, setEmail] = useState('admin@pranith.luxury');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickDemoAccess = async () => {
    setEmail('admin@pranith.luxury');
    setPassword('AdminPassword2026!');
    setErrorMessage(null);
    setLoading(true);
    const result = await login('admin@pranith.luxury', 'AdminPassword2026!');
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to authenticate with demo credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="font-display-luxury text-2xl font-bold tracking-widest text-amber-100">
            ប្រណិត ADMIN SUITE
          </div>
          <p className="text-xs text-stone-400">
            Secure Role-Based Authentication with Neon PostgreSQL & JWT.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="admin@pranith.luxury"
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none pl-10 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter password..."
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none pl-10 pr-10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Authenticate & Enter Suite'
            )}
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="pt-3 border-t border-stone-800 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            disabled={loading}
            className="w-full py-2.5 bg-stone-800/80 hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1-Click Super Admin Instant Login</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-full text-center text-xs text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1.5 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
