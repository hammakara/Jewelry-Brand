import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { login, setCurrentPage, language, setLanguage } = useStore();
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
      setErrorMessage(result.error || (language === 'en' ? 'Invalid credentials. Please verify your email and password.' : 'ព័ត៌មានចូលគណនីមិនត្រឹមត្រូវ។ សូមពិនិត្យអ៊ីម៉ែល និងលេខសម្ងាត់របស់អ្នក។'));
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl p-8 space-y-6">
        <div
          className="absolute top-4 right-4 flex items-center gap-1 bg-stone-950 rounded-lg p-1 border border-stone-700 text-[10px]"
          aria-label={language === 'en' ? 'Language selection' : 'ការជ្រើសរើសភាសា'}
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded transition-all ${
              language === 'en' ? 'bg-white text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('km')}
            className={`px-2 py-1 rounded transition-all ${
              language === 'km' ? 'bg-white text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            ខ្មែរ
          </button>
        </div>
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="font-display-luxury text-2xl font-bold tracking-widest text-amber-100">
            {language === 'en' ? 'ប្រណិត ADMIN SUITE' : 'ប្រណិត — ផ្នែកអ្នកគ្រប់គ្រង'}
          </div>
          <p className="text-xs text-stone-400">
            {language === 'en' ? 'Secure Role-Based Authentication with Neon PostgreSQL & JWT.' : 'ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណសុវត្ថិភាពតាមតួនាទី ជាមួយ Neon PostgreSQL និង JWT។'}
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
              {language === 'en' ? 'Admin Email' : 'អ៊ីម៉ែលអ្នកគ្រប់គ្រង'}
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
              {language === 'en' ? 'Secure Password' : 'លេខសម្ងាត់'}
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
                placeholder={language === 'en' ? 'Enter password...' : 'បញ្ចូលលេខសម្ងាត់...'}
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
              language === 'en' ? 'Authenticate & Enter Suite' : 'បញ្ជាក់អត្តសញ្ញាណ និងចូលបន្ទប់គ្រប់គ្រង'
            )}
          </button>
        </form>

        {/* Demo Access Removed - Default admin password is set via ADMIN_PASSWORD env var on first run. */}

        <div className="pt-3 border-t border-stone-800 space-y-3">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-full text-center text-xs text-stone-400 hover:text-stone-200 flex items-center justify-center gap-1.5 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Return to Boutique Website' : 'ត្រឡប់ទៅគេហទំព័រហាងវិញ'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
