import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  Phone, 
  Send, 
  ShieldCheck, 
  Search, 
  Clock, 
  Gem,
  ShoppingBag
} from 'lucide-react';
import { PageView } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    setSelectedCategorySlug,
    settings, 
    language, 
    setLanguage, 
    isAdminLoggedIn,
    orders
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;

  const navigate = (page: PageView, categorySlug: string | null = null) => {
    setSelectedCategorySlug(categorySlug);
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#63490D]/95 backdrop-blur-md border-b border-white/20 text-white shadow-lg">
      {/* Top Announcement Bar */}
      <div className="bg-[#4E3707] border-b border-white/15 py-1.5 px-4 text-xs font-light tracking-wider text-center text-white flex items-center justify-between">
        <div className="hidden md:flex items-center gap-4 text-white/80">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-white" />
            <a href={`tel:${settings.hotline}`} className="hover:text-white transition-colors">{settings.hotline}</a>
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1.5">
            <Send className="w-3 h-3 text-white" />
            <a href={settings.telegramGroupLink} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              @{settings.telegramUsername}
            </a>
          </span>
        </div>

        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-white animate-pulse" />
          <span className="font-medium">
            {language === 'en' 
              ? 'Complimentary Luxury Gift Velvet Box & Authenticity Certificate with Every Order' 
              : 'ថែមជូនប្រអប់ប្រណីត និងលិខិតបញ្ជាក់គុណភាពគុជខ្យងឥតគិតថ្លៃគ្រប់ការកុម្ម៉ង់'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#3A2703] rounded px-1.5 py-0.5 border border-white/25 text-[11px]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                language === 'en' ? 'bg-white text-[#523D0C] font-bold shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('km')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                language === 'km' ? 'bg-white text-[#523D0C] font-bold shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              ខ្មែរ
            </button>
          </div>

          {/* Admin Suite Toggle */}
          <button
            onClick={() => navigate('admin')}
            className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded border transition-all ${
              currentPage === 'admin' 
                ? 'bg-white text-[#523D0C] border-white font-bold shadow-sm'
                : 'border-white/40 text-white hover:bg-white/15'
            }`}
            title="Open Boutique Management System"
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Admin</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('home')} 
            className="cursor-pointer flex flex-col items-start select-none group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border border-white/60 flex items-center justify-center">
                <span className="w-2 h-2 bg-[#6E5212] rounded-full"></span>
              </span>
              <span className="font-display-luxury text-xl sm:text-2xl font-bold tracking-[0.15em] text-white group-hover:text-white/90 transition-colors">
                ប្រណិត
              </span>
              <span className="text-xs tracking-[0.25em] font-light text-white/85 hidden sm:inline">
                • PRANITH
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/90 font-semibold pl-8">
              Luxury Pearl Boutique
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase">
            <button
              onClick={() => navigate('home')}
              className={`transition-all relative py-1 ${
                currentPage === 'home' 
                  ? 'text-white' 
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Home' : 'ទំព័រដើម'}
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => navigate('shop')}
              className={`transition-all relative py-1 ${
                currentPage === 'shop' 
                  ? 'text-white' 
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Shop' : 'ទំនិញទាំងអស់'}
              {currentPage === 'shop' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => navigate('collections')}
              className={`transition-all relative py-1 ${
                currentPage === 'collections' 
                  ? 'text-white' 
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Collections' : 'កម្រងប្រណីត'}
              {currentPage === 'collections' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => navigate('about')}
              className={`transition-all relative py-1 ${
                currentPage === 'about' 
                  ? 'text-white' 
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {language === 'en' ? 'About Us' : 'អំពីយើង'}
              {currentPage === 'about' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => navigate('contact')}
              className={`transition-all relative py-1 ${
                currentPage === 'contact' 
                  ? 'text-white' 
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
              {currentPage === 'contact' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => navigate('order-tracker')}
              className={`transition-all relative py-1 flex items-center gap-1.5 ${
                currentPage === 'order-tracker' 
                  ? 'text-white' 
                  : 'text-white/75 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-white" />
              {language === 'en' ? 'Track Order' : 'តាមដានការកុម្ម៉ង់'}
              {currentPage === 'order-tracker' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full"></span>
              )}
            </button>
          </nav>

          {/* Right Action: Shop Collection Button (Primary White) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('shop')}
              className="px-6 py-2.5 bg-white hover:bg-neutral-100 text-[#543D0B] text-xs uppercase tracking-widest font-bold rounded transition-all duration-200 shadow-[0_4px_16px_rgba(255,255,255,0.35)] hover:shadow-[0_6px_22px_rgba(255,255,255,0.5)] flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#543D0B]" />
              <span>{language === 'en' ? 'Shop Collection' : 'មើលទំនិញ'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => navigate('shop')}
              className="p-2 text-white hover:text-white/80"
              aria-label="Shop"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-white/80 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#59400A] border-b border-white/20 px-6 py-6 animate-in slide-in-from-top-4 duration-200 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3 font-medium uppercase tracking-wider text-sm">
            <button
              onClick={() => navigate('home')}
              className={`text-left py-2 border-b border-white/10 ${
                currentPage === 'home' ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              {language === 'en' ? 'Home' : 'ទំព័រដើម'}
            </button>
            <button
              onClick={() => navigate('shop')}
              className={`text-left py-2 border-b border-white/10 ${
                currentPage === 'shop' ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              {language === 'en' ? 'Shop Pearls' : 'ទំនិញគុជខ្យង'}
            </button>
            <button
              onClick={() => navigate('collections')}
              className={`text-left py-2 border-b border-white/10 ${
                currentPage === 'collections' ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              {language === 'en' ? 'Collections' : 'កម្រងប្រណីត'}
            </button>
            <button
              onClick={() => navigate('about')}
              className={`text-left py-2 border-b border-white/10 ${
                currentPage === 'about' ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              {language === 'en' ? 'About Us' : 'អំពីយើង'}
            </button>
            <button
              onClick={() => navigate('contact')}
              className={`text-left py-2 border-b border-white/10 ${
                currentPage === 'contact' ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              {language === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
            </button>
            <button
              onClick={() => navigate('order-tracker')}
              className={`text-left py-2 border-b border-white/10 flex items-center gap-2 ${
                currentPage === 'order-tracker' ? 'text-white font-bold' : 'text-white/70'
              }`}
            >
              <Clock className="w-4 h-4 text-white" />
              {language === 'en' ? 'Track Order Request' : 'តាមដានការកុម្ម៉ង់'}
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('shop')}
              className="w-full py-3 bg-white text-[#543D0B] font-bold text-center text-xs uppercase tracking-widest rounded shadow-lg"
            >
              {language === 'en' ? 'Explore Pearl Catalog' : 'មើលកាតាឡុកគុជខ្យង'}
            </button>

            <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs text-white/80">
              <a href={`tel:${settings.hotline}`} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="w-3.5 h-3.5 text-white" />
                {settings.hotline}
              </a>
              <a href={settings.telegramGroupLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white font-semibold">
                <Send className="w-3.5 h-3.5 text-white" />
                Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
