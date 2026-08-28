import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  Phone, 
  Send, 
  ShieldCheck, 
  Clock, 
  ShoppingBag,
  User,
  LogOut,
  UserCheck,
  KeyRound
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
    currentUser,
    openAuthModal,
    logout,
    openChangePasswordModal,
    orders
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;

  const navigate = (page: PageView, categorySlug: string | null = null) => {
    setSelectedCategorySlug(categorySlug);
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
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

          {/* Secure User Auth Profile / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium transition"
              >
                <UserCheck className="w-3 h-3 text-amber-300" />
                <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 rounded uppercase font-bold">
                  {currentUser.role}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-stone-900 border border-amber-500/30 rounded-xl shadow-2xl py-2 z-50 text-left text-xs text-stone-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-stone-800">
                    <div className="font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-stone-400 truncate">{currentUser.email}</div>
                    <div className="text-[9px] text-amber-400 font-semibold uppercase mt-0.5">Role: {currentUser.role}</div>
                  </div>

                  {currentUser.role === 'ADMIN' && (
                    <button
                      onClick={() => navigate('admin')}
                      className="w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center justify-between text-amber-200"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        Admin Suite
                      </span>
                      {pendingOrdersCount > 0 && (
                        <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                          {pendingOrdersCount}
                        </span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => navigate('order-tracker')}
                    className="w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center gap-2 text-stone-300"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Track Orders
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openChangePasswordModal();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center gap-2 text-stone-300"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    Change Password
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center gap-2 text-rose-300 border-t border-stone-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded border border-white/40 text-white hover:bg-white/15 transition-all"
            >
              <User className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}
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

          {/* Right Action: Shop Collection Button */}
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
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 bg-white/15 border border-white/30 text-white font-bold text-center text-xs uppercase tracking-widest rounded"
              >
                Sign In / Register VIP
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2 bg-rose-500/20 text-rose-200 border border-rose-400/40 text-xs font-semibold rounded"
              >
                Sign Out ({currentUser.name})
              </button>
            )}

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
