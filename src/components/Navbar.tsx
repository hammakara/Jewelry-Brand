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
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0B] border-b border-[#C9A227]/20 text-[#F8F5EE]">
      {/* Top Announcement Bar */}
      <div className="bg-[#141414] border-b border-[#C9A227]/10 py-1.5 px-4 text-xs font-light tracking-wider text-center text-[#E6C766]/90 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-[#C9A227]" />
            <a href={`tel:${settings.hotline}`} className="hover:text-[#E6C766] transition-colors">{settings.hotline}</a>
          </span>
          <span className="text-[#C9A227]/40">•</span>
          <span className="flex items-center gap-1.5">
            <Send className="w-3 h-3 text-[#C9A227]" />
            <a href={settings.telegramGroupLink} target="_blank" rel="noreferrer" className="hover:text-[#E6C766] transition-colors">
              @{settings.telegramUsername}
            </a>
          </span>
        </div>

        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-[#C9A227] animate-pulse" />
          <span>
            {language === 'en' 
              ? 'Complimentary Luxury Gift Velvet Box & Authenticity Certificate with Every Order' 
              : 'ថែមជូនប្រអប់ប្រណីត និងលិខិតបញ្ជាក់គុណភាពគុជខ្យងឥតគិតថ្លៃគ្រប់ការកុម្ម៉ង់'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#1E1E1E] rounded px-1.5 py-0.5 border border-[#C9A227]/30 text-[11px]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'en' ? 'bg-[#C9A227] text-[#0B0B0B] font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('km')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'km' ? 'bg-[#C9A227] text-[#0B0B0B] font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              ខ្មែរ
            </button>
          </div>

          {/* Admin Suite Toggle */}
          <button
            onClick={() => navigate('admin')}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-all ${
              currentPage === 'admin' 
                ? 'bg-[#C9A227] text-[#0B0B0B] border-[#C9A227] font-semibold'
                : 'border-[#C9A227]/40 text-[#E6C766] hover:bg-[#C9A227]/10'
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
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full pearl-shimmer border border-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.5)] flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full"></span>
              </span>
              <span className="font-display-luxury text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#F8F5EE] group-hover:text-[#E6C766] transition-colors">
                MAISON DES PERLES
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#C9A227] font-medium pl-7">
              Haute Joaillerie &bull; Pearls
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider uppercase">
            <button
              onClick={() => navigate('home')}
              className={`transition-colors relative py-1 ${
                currentPage === 'home' 
                  ? 'text-[#C9A227]' 
                  : 'text-gray-300 hover:text-[#E6C766]'
              }`}
            >
              {language === 'en' ? 'Home' : 'ទំព័រដើម'}
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A227]"></span>
              )}
            </button>

            <button
              onClick={() => navigate('shop')}
              className={`transition-colors relative py-1 ${
                currentPage === 'shop' 
                  ? 'text-[#C9A227]' 
                  : 'text-gray-300 hover:text-[#E6C766]'
              }`}
            >
              {language === 'en' ? 'Shop' : 'ទំនិញទាំងអស់'}
              {currentPage === 'shop' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A227]"></span>
              )}
            </button>

            <button
              onClick={() => navigate('collections')}
              className={`transition-colors relative py-1 ${
                currentPage === 'collections' 
                  ? 'text-[#C9A227]' 
                  : 'text-gray-300 hover:text-[#E6C766]'
              }`}
            >
              {language === 'en' ? 'Collections' : 'កម្រងប្រណីត'}
              {currentPage === 'collections' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A227]"></span>
              )}
            </button>

            <button
              onClick={() => navigate('about')}
              className={`transition-colors relative py-1 ${
                currentPage === 'about' 
                  ? 'text-[#C9A227]' 
                  : 'text-gray-300 hover:text-[#E6C766]'
              }`}
            >
              {language === 'en' ? 'About Us' : 'អំពីយើង'}
              {currentPage === 'about' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A227]"></span>
              )}
            </button>

            <button
              onClick={() => navigate('contact')}
              className={`transition-colors relative py-1 ${
                currentPage === 'contact' 
                  ? 'text-[#C9A227]' 
                  : 'text-gray-300 hover:text-[#E6C766]'
              }`}
            >
              {language === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
              {currentPage === 'contact' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A227]"></span>
              )}
            </button>

            <button
              onClick={() => navigate('order-tracker')}
              className={`transition-colors relative py-1 flex items-center gap-1.5 ${
                currentPage === 'order-tracker' 
                  ? 'text-[#C9A227]' 
                  : 'text-gray-300 hover:text-[#E6C766]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
              {language === 'en' ? 'Track Order' : 'តាមដានការកុម្ម៉ង់'}
              {currentPage === 'order-tracker' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A227]"></span>
              )}
            </button>
          </nav>

          {/* Right Action: Shop Collection Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('shop')}
              className="px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs uppercase tracking-widest font-semibold rounded transition-all duration-200 shadow-[0_4px_14px_rgba(201,162,39,0.3)] hover:shadow-[0_6px_20px_rgba(201,162,39,0.5)] flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Shop Collection' : 'មើលទំនិញ'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => navigate('shop')}
              className="p-2 text-[#C9A227] hover:text-white"
              aria-label="Shop"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-[#C9A227] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0B] border-b border-[#C9A227]/30 px-6 py-6 animate-in slide-in-from-top-4 duration-200 space-y-4">
          <div className="flex flex-col space-y-3 font-medium uppercase tracking-wider text-sm">
            <button
              onClick={() => navigate('home')}
              className={`text-left py-2 border-b border-gray-800 ${
                currentPage === 'home' ? 'text-[#C9A227]' : 'text-gray-300'
              }`}
            >
              {language === 'en' ? 'Home' : 'ទំព័រដើម'}
            </button>
            <button
              onClick={() => navigate('shop')}
              className={`text-left py-2 border-b border-gray-800 ${
                currentPage === 'shop' ? 'text-[#C9A227]' : 'text-gray-300'
              }`}
            >
              {language === 'en' ? 'Shop Pearls' : 'ទំនិញគុជខ្យង'}
            </button>
            <button
              onClick={() => navigate('collections')}
              className={`text-left py-2 border-b border-gray-800 ${
                currentPage === 'collections' ? 'text-[#C9A227]' : 'text-gray-300'
              }`}
            >
              {language === 'en' ? 'Collections' : 'កម្រងប្រណីត'}
            </button>
            <button
              onClick={() => navigate('about')}
              className={`text-left py-2 border-b border-gray-800 ${
                currentPage === 'about' ? 'text-[#C9A227]' : 'text-gray-300'
              }`}
            >
              {language === 'en' ? 'About Us' : 'អំពីយើង'}
            </button>
            <button
              onClick={() => navigate('contact')}
              className={`text-left py-2 border-b border-gray-800 ${
                currentPage === 'contact' ? 'text-[#C9A227]' : 'text-gray-300'
              }`}
            >
              {language === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
            </button>
            <button
              onClick={() => navigate('order-tracker')}
              className={`text-left py-2 border-b border-gray-800 flex items-center gap-2 ${
                currentPage === 'order-tracker' ? 'text-[#C9A227]' : 'text-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 text-[#C9A227]" />
              {language === 'en' ? 'Track Order Request' : 'តាមដានការកុម្ម៉ង់'}
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('shop')}
              className="w-full py-3 bg-[#C9A227] text-[#0B0B0B] font-bold text-center text-xs uppercase tracking-widest rounded"
            >
              {language === 'en' ? 'Explore Pearl Catalog' : 'មើលកាតាឡុកគុជខ្យង'}
            </button>

            <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs text-gray-400">
              <a href={`tel:${settings.hotline}`} className="flex items-center gap-1.5 hover:text-[#C9A227]">
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                {settings.hotline}
              </a>
              <a href={settings.telegramGroupLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#E6C766]">
                <Send className="w-3.5 h-3.5" />
                Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
