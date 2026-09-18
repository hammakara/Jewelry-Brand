import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User, Phone, Eye, EyeOff, ShieldCheck, X, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    language,
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
        setErrorMessage(result.error || (language === 'en' ? 'Invalid credentials. Please check your email and password.' : 'ព័ត៌មានសម្គាល់មិនត្រឹមត្រូវ។ សូមពិនិត្យអ៊ីមែល និងលេខសម្ងាត់របស់អ្នក។'));
      }
    } else {
      if (password.length < 6) {
        setLoading(false);
        setErrorMessage(language === 'en' ? 'Password must be at least 6 characters long.' : 'លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។');
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
        setErrorMessage(result.error || (language === 'en' ? 'Registration failed. Please try again.' : 'ការចុះឈ្មោះបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។'));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
          aria-label={language === 'en' ? 'Close modal' : 'បិទប្រអប់'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display-luxury text-xl sm:text-2xl font-bold tracking-wide text-white">
            {authModalTab === 'login'
              ? (language === 'en' ? 'Boutique Client & Admin Sign In' : 'ចូលគណនីអតិថិជន និងអ្នកគ្រប់គ្រង')
              : (language === 'en' ? 'Create VIP Customer Account' : 'បង្កើតគណនីអតិថិជន VIP')}
          </h2>
          <p className="text-xs text-stone-400">
            {authModalTab === 'login'
              ? (language === 'en' ? 'Sign in to access your luxury customer orders or administrative suite.' : 'ចូលដើម្បីចូលដល់ការកុម្ម៉ង់អតិថិជន ឬផ្នែកគ្រប់គ្រងរបស់អ្នក។')
              : (language === 'en' ? 'Register your customer account for order history and personalized concierge services.' : 'ចុះឈ្មោះគណនីអតិថិជនរបស់អ្នកដើម្បីមើលប្រវត្តិការកុម្ម៉ង់ និងសេវាកម្មផ្ទាល់ខ្លួន។')}
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
            {language === 'en' ? 'Sign In' : 'ចូលគណនី'}
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
            {language === 'en' ? 'Register' : 'ចុះឈ្មោះ'}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
            <span className="font-bold">{language === 'en' ? 'Error:' : 'កំហុស៖'}</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {language === 'en' ? 'Full Name' : 'ឈ្មោះពេញ'}
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
                  {language === 'en' ? 'Telegram / Phone (Optional)' : 'តេលេក្រាម / ទូរស័ព្ទ (ជម្រើស)'}
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
              {language === 'en' ? 'Email Address' : 'អាសយដ្ឋានអ៊ីមែល'}
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
              {language === 'en' ? 'Password' : 'លេខសម្ងាត់'}
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
              <p className="text-[11px] text-stone-500 mt-1">{language === 'en' ? 'Must be at least 6 characters.' : 'ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។'}</p>
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
                <span>{authModalTab === 'login' ? (language === 'en' ? 'Sign In' : 'ចូលគណនី') : (language === 'en' ? 'Create Account' : 'បង្កើតគណនី')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
