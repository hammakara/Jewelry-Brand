import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  AlertCircle 
} from 'lucide-react';

export const ChangePasswordModal: React.FC = () => {
  const { 
    isChangePasswordModalOpen, 
    closeChangePasswordModal, 
    currentUser, 
    changePassword, 
    language,
  } = useStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isChangePasswordModalOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage(language === 'en' ? 'Please enter your current password.' : 'សូមបញ្ចូលលេខសម្ងាត់បច្ចុប្បន្នរបស់អ្នក។');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(language === 'en' ? 'New password must be at least 6 characters long.' : 'លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(language === 'en' ? 'New passwords do not match.' : 'លេខសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ។');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(language === 'en' ? 'New password cannot be the same as your current password.' : 'លេខសម្ងាត់ថ្មីមិនអាចដូចលេខសម្ងាត់បច្ចុប្បន្នរបស់អ្នកបានទេ។');
      return;
    }

    setLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      closeChangePasswordModal();
    } else {
      setErrorMessage(language === 'en' ? 'Failed to update password. Please check your current password.' : 'មិនអាចផ្លាស់ប្តូរលេខសម្ងាត់បានទេ។ សូមពិនិត្យលេខសម្ងាត់បច្ចុប្បន្នរបស់អ្នក។');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeChangePasswordModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors"
          aria-label={language === 'en' ? 'Close modal' : 'បិទប្រអប់'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-1">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-display-luxury text-xl sm:text-2xl font-bold tracking-wide text-white">
            {language === 'en' ? 'Change Your Password' : 'ផ្លាស់ប្តូរលេខសម្ងាត់របស់អ្នក'}
          </h2>
          <p className="text-xs text-stone-400">
            {language === 'en' ? 'Update the security credentials for your boutique account.' : 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានសុវត្ថិភាពសម្រាប់គណនីប៊ូទិករបស់អ្នក។'}
          </p>

          {/* User badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-800/80 rounded-xl border border-stone-700/60 text-xs text-stone-300 mt-2">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-white truncate max-w-[180px]">{currentUser.name}</span>
            <span className="text-[10px] text-stone-400">({currentUser.email})</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
              currentUser.role === 'ADMIN'
                ? 'bg-amber-400 text-stone-950'
                : 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40'
            }`}>
              {currentUser.role === 'ADMIN'
                ? (language === 'en' ? 'Administrator' : 'អ្នកគ្រប់គ្រង')
                : (language === 'en' ? 'Customer' : 'អតិថិជន')}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-600/60 rounded-xl text-xs text-rose-200 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              {language === 'en' ? 'Current Password' : 'លេខសម្ងាត់បច្ចុប្បន្ន'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              {language === 'en' ? 'New Password' : 'លេខសម្ងាត់ថ្មី'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={language === 'en' ? 'At least 6 characters' : 'យ៉ាងតិច ៦ តួអក្សរ'}
                className="w-full bg-stone-950/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              {language === 'en' ? 'Confirm New Password' : 'បញ្ជាក់លេខសម្ងាត់ថ្មី'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={language === 'en' ? 'Re-enter new password' : 'បញ្ចូលលេខសម្ងាត់ថ្មីម្តងទៀត'}
                className="w-full bg-stone-950/80 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && confirmPassword && (
              <div className="mt-1.5 text-[11px] flex items-center gap-1.5">
                {newPassword === confirmPassword ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'en' ? 'Passwords match' : 'លេខសម្ងាត់ត្រូវគ្នា'}
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {language === 'en' ? 'Passwords do not match' : 'លេខសម្ងាត់មិនត្រូវគ្នាទេ'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{language === 'en' ? 'Update Password' : 'ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-400">
            {language === 'en' ? 'For security, your password change takes effect immediately across all active sessions.' : 'សម្រាប់សុវត្ថិភាព ការផ្លាស់ប្តូរលេខសម្ងាត់របស់អ្នកនឹងចូលជាធរមានភ្លាមៗសម្រាប់រាល់សម័យប្រើប្រាស់សកម្មទាំងអស់។'}
          </p>
        </div>
      </div>
    </div>
  );
};
