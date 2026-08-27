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
    <div className="min-h-screen bg-[#7B5B12] text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#523B08] border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#3D2B05] border border-white/40 flex items-center justify-center mx-auto text-white mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <div className="font-display-luxury text-xl font-bold tracking-widest text-white">
            ប្រណិត ADMIN SUITE
          </div>
          <p className="text-xs text-white/80">
            Secure management portal for boutique products, order requests, and customer CRM.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">
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
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-4 py-3 text-sm text-white placeholder-white/50 outline-none pl-10"
              />
              <KeyRound className="w-4 h-4 text-white/60 absolute left-3.5 top-3.5" />
            </div>
            {error && (
              <p className="text-xs text-rose-300 mt-1.5 font-bold">
                Invalid passcode. You can click the "1-Click Demo Login" below.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"
          >
            Access Admin Portal
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="pt-2 border-t border-white/20 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="w-full py-2.5 bg-[#3D2B05] hover:bg-white text-white hover:text-[#523D0C] border border-white/30 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Quick Demo Admin Login</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-full text-center text-xs text-white/80 hover:text-white flex items-center justify-center gap-1 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
