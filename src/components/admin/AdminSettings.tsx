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
  const { settings, updateSettings, showToast, openChangePasswordModal, language } = useStore();

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
    showToast(language === 'en' ? 'Boutique store settings updated successfully!' : 'ការកំណត់ហាងត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!', 'gold');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-white">
          {language === 'en' ? 'Store & System Configuration' : 'ការកំណត់រចនាសម្ព័ន្ធហាង និងប្រព័ន្ធ'}
        </h2>
        <p className="text-xs text-white/80">
          {language === 'en' ? 'Configure concierge contact lines, exchange rates, boutique addresses, and administrative passcodes.' : 'កំណត់រចនាសម្ព័ន្ធបណ្តាញទំនាក់ទំនងសេវាកម្ម អត្រាប្តូរប្រាក់ អាសយដ្ឋានហាង និងលេខសម្ងាត់គ្រប់គ្រង។'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Boutique Branding */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {language === 'en' ? 'Store Identity' : 'អត្តសញ្ញាណហាង'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                {language === 'en' ? 'Store / Brand Name' : 'ឈ្មោះហាង / ម៉ាកយីហោ'}
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
                {language === 'en' ? 'Tagline' : 'ពាក្យស្លោក'}
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
            {language === 'en' ? 'Concierge Channels (Telegram & Phone)' : 'បណ្តាញសេវាកម្មទំនាក់ទំនង (Telegram & ទូរសព្ទ)'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                {language === 'en' ? 'Telegram Username (without @)' : 'ឈ្មោះអ្នកប្រើ Telegram (មិនរាប់ @)'}
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
                {language === 'en' ? 'Telegram Channel / Direct Link' : 'Telegram Channel / តំណផ្ទាល់'}
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
                {language === 'en' ? 'Hotline Phone Number' : 'លេខទូរសព្ទក្តៅ'}
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
                {language === 'en' ? 'Official Email' : 'អ៊ីមែលផ្លូវការ'}
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
            {language === 'en' ? 'Currency & Showroom Location' : 'រូបិយប័ណ្ណ និងទីតាំងបន្ទប់តាំងបង្ហាញ'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1">
                {language === 'en' ? 'USD to KHR Exchange Rate (1 USD =)' : 'អត្រាប្តូរប្រាក់ USD ទៅ KHR (1 USD =)'}
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
                {language === 'en' ? 'Showroom Operating Hours' : 'ម៉ោងបើកហាង'}
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
                {language === 'en' ? 'Showroom Physical Address' : 'អាសយដ្ឋានបន្ទប់តាំងបង្ហាញ'}
              </label>
              <input
                type="text"
                value={formData.boutiqueAddress}
                onChange={(e) => setFormData({ ...formData, boutiqueAddress: e.target.value })}
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-white mb-1">
                {language === 'en' ? 'Showroom Physical Address (Khmer)' : 'អាសយដ្ឋានបន្ទប់តាំងបង្ហាញ (ខ្មែរ)'}
              </label>
              <input
                type="text"
                value={formData.boutiqueAddressKhmer}
                onChange={(e) => setFormData({ ...formData, boutiqueAddressKhmer: e.target.value })}
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
                {language === 'en' ? 'Admin Password & Credentials' : 'ពាក្យសម្ងាត់ និងលិខិតសម្គាល់អ្នកគ្រប់គ្រង'}
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                {language === 'en' ? 'Update your administrator account password or system fallback passcode.' : 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់គណនីអ្នកគ្រប់គ្រង ឬលេខសម្ងាត់បម្រុងនៃប្រព័ន្ធ។'}
              </p>
            </div>

            <button
              type="button"
              onClick={openChangePasswordModal}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <KeyRound className="w-4 h-4" />
              <span>{language === 'en' ? 'Change My Password' : 'ផ្លាស់ប្តូរលេខសម្ងាត់របស់ខ្ញុំ'}</span>
            </button>
          </div>

          <div className="max-w-xs pt-2 border-t border-white/10">
            <label className="block text-xs font-bold text-white mb-1">
              {language === 'en' ? 'Fallback Passcode (leave blank to keep current)' : 'លេខសម្ងាត់បម្រុង (ទុកចោលដើម្បីរក្សាលេខសម្ងាត់បច្ចុប្បន្ន)'}
            </label>
            <input
              type="password"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder={language === 'en' ? 'Enter new passcode' : 'បញ្ចូលលេខសម្ងាត់ថ្មី'}
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
              <span>{language === 'en' ? 'Cloud Infrastructure: Next.js + PostgreSQL + Cloud Media' : 'ហេដ្ឋារចនាសម្ព័ន្ធក្លោដ៍: Next.js + PostgreSQL + Cloud Media'}</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-bold">{language === 'en' ? 'Active ($15/mo)' : 'សកម្ម ($15/ខែ)'}</span>
            </div>
            <p className="text-white/80">
              {language === 'en' ? 'Low-cost, high-performance luxury architecture tailored for $300 MVP build + $15/month managed maintenance.' : 'ស្ថាបត្យកម្មប្រណិតមានតម្លៃទាប ដំណើរការល្បឿនលឿន រៀបចំសម្រាប់ការកសាង MVP $300 + ការថែទាំគ្រប់គ្រង $15/ខែ។'}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Settings Saved!' : 'បានរក្សាទុកការកំណត់!'}</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'en' ? 'Save All Store Settings' : 'រក្សាទុកការកំណត់ហាងទាំងអស់'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
