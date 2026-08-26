import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 bg-[#0B0B0B] text-white border border-[#C9A227]/40 shadow-2xl p-4 rounded-lg animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="mt-0.5 text-[#C9A227]">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#E6C766]" />}
            {toast.type === 'gold' && <Sparkles className="w-5 h-5 text-[#C9A227]" />}
          </div>
          <div className="flex-1 text-sm font-medium leading-snug">
            {toast.message}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
