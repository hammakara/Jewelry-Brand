import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, KeyRound, Sparkles, ArrowLeft, Lock } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { loginAdmin, setCurrentPage } = useStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode.trim());
    if (!success) {
      setError(true);
    }
  };

  const handleQuickDemoAccess = () => {
    loginAdmin('admin123');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EE] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#141414] border border-[#C9A227]/40 rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 border border-[#C9A227] flex items-center justify-center mx-auto text-[#C9A227] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <div className="font-display-luxury text-xl font-bold tracking-widest text-[#F8F5EE]">
            MAISON ADMIN SUITE
          </div>
          <p className="text-xs text-gray-400">
            Secure management portal for boutique products, order requests, and customer CRM.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode (e.g. admin123)"
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none pl-10"
              />
              <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1.5">
                Invalid passcode. You can click the "1-Click Demo Login" below.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"
          >
            Access Admin Portal
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="pt-2 border-t border-gray-800 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="w-full py-2.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#E6C766] border border-[#C9A227]/30 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Quick Demo Admin Login</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-full text-center text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
