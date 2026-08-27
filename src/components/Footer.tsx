import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  ShieldCheck, 
  Award, 
  Truck, 
  HeartHandshake,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { PageView } from '../types';

export const Footer: React.FC = () => {
  const { settings, setCurrentPage, setSelectedCategorySlug, language } = useStore();

  const navigate = (page: PageView, categorySlug: string | null = null) => {
    setSelectedCategorySlug(categorySlug);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#523B08] text-white border-t border-white/20">
      {/* Value Proposition & Reassurance Bar */}
      <div className="border-b border-white/15 bg-[#442F05] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded bg-white text-[#523D0C] shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide text-white">
                  {language === 'en' ? '100% Genuine Pearls' : 'គុជខ្យងធម្មជាតិពិត ១០០%'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'en' ? 'Freshwater, Akoya, South Sea & Tahitian' : 'គុជខ្យងទឹកសាប ទឹកប្រៃ Akoya និងតាហ៊ីទី'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded bg-white text-[#523D0C] shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide text-white">
                  {language === 'en' ? 'Authenticity Certificate' : 'វិញ្ញាបនបត្របញ្ជាក់គុណភាព'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'en' ? 'Every piece verified by certified gemologists' : 'ធានាគុណភាពដោយអ្នកជំនាញត្បូងពេជ្រ'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded bg-white text-[#523D0C] shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide text-white">
                  {language === 'en' ? 'Secured Express Delivery' : 'សេវាដឹកជញ្ជូនរហ័ស & សុវត្ថិភាព'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'en' ? 'Complimentary delivery nationwide & global' : 'ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំងប្រទេស'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded bg-white text-[#523D0C] shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide text-white">
                  {language === 'en' ? 'Bespoke Concierge' : 'សេវាកម្មកុម្ម៉ង់ផ្ទាល់ខ្លួន'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'en' ? 'Personal jewelry advisor via Telegram' : 'ប្រឹក្សាផ្ទាល់តាម Telegram គ្រប់ពេលវេលា'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('home')}>
              <span className="w-6 h-6 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <span className="w-2 h-2 bg-[#523D0C] rounded-full"></span>
              </span>
              <span className="font-display-luxury text-xl font-bold tracking-[0.15em] text-white">
                ប្រណិត
              </span>
              <span className="text-xs tracking-[0.2em] font-light text-white/80">
                • PRANITH
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-md">
              {language === 'en'
                ? 'Curators of rare, ethically harvested marine and freshwater pearls. Crafted in 18K solid gold and sterling silver for discerning collectors.'
                : 'ហាងគ្រឿងអលង្ការគុជខ្យងធម្មជាតិដ៏ប្រណីត ស្រោបដោយមាស 18K និងប្រាក់សុទ្ធ ៩២៥ រចនាឡើងដើម្បីលើកកម្ពស់ភាពថ្លៃថ្នូររបស់អ្នក។'}
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs text-white/85">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>{language === 'en' ? settings.boutiqueAddress : settings.boutiqueAddressKhmer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href={`tel:${settings.hotline}`} className="hover:text-white transition-colors">{settings.hotline}</a>
              </div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-white shrink-0" />
                <a href={settings.telegramGroupLink} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Telegram: @{settings.telegramUsername}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display-luxury text-sm font-bold tracking-wider text-white uppercase mb-4">
              {language === 'en' ? 'Boutique' : 'ម៉ឺនុយ'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Homepage' : 'ទំព័រដើម'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'All Jewelry Collection' : 'កាតាឡុកគុជខ្យង'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('collections')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Curated Sets & Suites' : 'ឈុតគ្រឿងអលង្ការ'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Our Heritage & Ethics' : 'ប្រវត្តិ & ការធានា'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Contact Concierge' : 'ទំនាក់ទំនង'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('order-tracker')} className="hover:text-white transition-colors flex items-center gap-1 text-white font-semibold">
                  <Clock className="w-3 h-3 text-white" />
                  {language === 'en' ? 'Track Order Request' : 'តាមដានការកុម្ម៉ង់'}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display-luxury text-sm font-bold tracking-wider text-white uppercase mb-4">
              {language === 'en' ? 'Categories' : 'ប្រភេទគុជ'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <button onClick={() => navigate('shop', 'cat-necklace')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Pearl Necklaces' : 'ខ្សែកគុជខ្យង'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', 'cat-earrings')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Pearl Earrings' : 'ក្រវិលគុជខ្យង'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', 'cat-bracelet')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Pearl Bracelets' : 'កងដៃគុជខ្យង'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', 'cat-ring')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Pearl Rings' : 'ចិញ្ចៀនគុជខ្យង'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', 'cat-set')} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Bridal Sets' : 'ឈុតកូនក្រមុំ'}
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Ordering Process */}
          <div>
            <h4 className="font-display-luxury text-sm font-bold tracking-wider text-white uppercase mb-4">
              {language === 'en' ? 'How to Order' : 'របៀបកុម្ម៉ង់ទិញ'}
            </h4>
            <div className="space-y-3 text-xs text-white/80">
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'Select your desired pearl piece, click "Contact to Order", and our boutique concierge will immediately contact you via Telegram or phone to finalize your order.'
                  : 'ជ្រើសរើសម៉ូដគុជខ្យងដែលអ្នកពេញចិត្ត រួចចុច "Contact to Order" ក្រុមការងារយើងនឹងទាក់ទងតាម Telegram ឬទូរស័ព្ទភ្លាមៗ។'}
              </p>
              <a
                href={settings.telegramGroupLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-100 text-[#523D0C] rounded shadow transition-all duration-200 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Telegram Concierge' : 'ឆាតតាម Telegram'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & admin access */}
        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} ប្រណិត (PRANITH) Luxury Pearl Boutique. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/70">Boutique Haute Joaillerie</span>
            <button
              onClick={() => navigate('admin')}
              className="text-white font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
