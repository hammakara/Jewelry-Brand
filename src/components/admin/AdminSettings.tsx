import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Save, 
  Settings, 
  Send, 
  Phone, 
  DollarSign, 
  MapPin, 
  KeyRound, 
  CheckCircle,
  ShieldAlert,
  Server
} from 'lucide-react';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [newPasscode, setNewPasscode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<StoreSettings> = { ...formData };
    if (newPasscode.trim()) {
      payload.adminPasscode = newPasscode.trim();
    }
    updateSettings(payload);
    setSavedSuccess(true);
    showToast('Boutique store settings updated successfully!', 'gold');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-white">
          Store & System Configuration
        </h2>
        <p className="text-xs text-gray-400">
          Configure concierge contact lines, exchange rates, boutique addresses, and administrative passcodes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Boutique Branding */}
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6C766]">
            Store Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Store / Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName || formData.storeName || ''}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value, storeName: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Concierge */}
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6C766]">
            Concierge Channels (Telegram & Phone)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Telegram Username (without @)
              </label>
              <input
                type="text"
                value={formData.telegramUsername}
                onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Telegram Channel / Direct Link
              </label>
              <input
                type="text"
                value={formData.telegramGroupLink}
                onChange={(e) => setFormData({ ...formData, telegramGroupLink: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Hotline Phone Number
              </label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Showroom */}
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6C766]">
            Currency & Showroom Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                USD to KHR Exchange Rate (1 USD =)
              </label>
              <input
                type="number"
                value={formData.exchangeRateKhr}
                onChange={(e) => setFormData({ ...formData, exchangeRateKhr: parseInt(e.target.value) || 4100 })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Showroom Operating Hours
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Showroom Physical Address
              </label>
              <input
                type="text"
                value={formData.boutiqueAddress}
                onChange={(e) => setFormData({ ...formData, boutiqueAddress: e.target.value })}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & Admin Passcode */}
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6C766]">
            Admin Passcode Security
          </h3>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              New Admin Passcode (leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="Enter new passcode"
              className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Deployment & Architecture Info */}
        <div className="bg-[#101010] border border-emerald-900/40 rounded-xl p-5 flex items-start gap-4">
          <div className="p-2.5 bg-emerald-950/80 text-emerald-400 rounded-lg shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Cloud Infrastructure: Next.js + Neon PostgreSQL + Vercel Blob</span>
              <span className="bg-emerald-900 text-emerald-300 text-[10px] px-2 py-0.5 rounded">Active ($15/mo)</span>
            </div>
            <p className="text-gray-400">
              Low-cost, high-performance luxury architecture tailored for $300 MVP build + $15/month managed maintenance.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Settings Saved!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save All Store Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
