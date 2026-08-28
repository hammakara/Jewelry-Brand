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
  const { settings, updateSettings, showToast, openChangePasswordModal } = useStore();

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
        <p className="text-xs text-white/80">
          Configure concierge contact lines, exchange rates, boutique addresses, and administrative passcodes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Boutique Branding */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Store Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Store / Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName || formData.storeName || ''}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value, storeName: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Concierge */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Concierge Channels (Telegram & Phone)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Telegram Username (without @)
              </label>
              <input
                type="text"
                value={formData.telegramUsername}
                onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Telegram Channel / Direct Link
              </label>
              <input
                type="text"
                value={formData.telegramGroupLink}
                onChange={(e) => setFormData({ ...formData, telegramGroupLink: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Hotline Phone Number
              </label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Showroom */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Currency & Showroom Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                USD to KHR Exchange Rate (1 USD =)
              </label>
              <input
                type="number"
                value={formData.exchangeRateKhr}
                onChange={(e) => setFormData({ ...formData, exchangeRateKhr: parseInt(e.target.value) || 4100 })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1">
                Showroom Operating Hours
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-white mb-1">
                Showroom Physical Address
              </label>
              <input
                type="text"
                value={formData.boutiqueAddress}
                onChange={(e) => setFormData({ ...formData, boutiqueAddress: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & Admin Credentials */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Admin Password & Credentials
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                Update your administrator account password or system fallback passcode.
              </p>
            </div>

            <button
              type="button"
              onClick={openChangePasswordModal}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change My Password</span>
            </button>
          </div>

          <div className="max-w-xs pt-2 border-t border-white/10">
            <label className="block text-xs font-bold text-white mb-1">
              Fallback Passcode (leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="Enter new passcode"
              className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Deployment & Architecture Info */}
        <div className="bg-[#3D2B05] border border-white/20 rounded-2xl p-5 flex items-start gap-4 shadow-md">
          <div className="p-2.5 bg-[#523B08] text-white rounded-lg shrink-0 border border-white/20">
            <Server className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span>Cloud Infrastructure: Next.js + PostgreSQL + Cloud Media</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-bold">Active ($15/mo)</span>
            </div>
            <p className="text-white/80">
              Low-cost, high-performance luxury architecture tailored for $300 MVP build + $15/month managed maintenance.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Settings Saved!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Save All Store Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
