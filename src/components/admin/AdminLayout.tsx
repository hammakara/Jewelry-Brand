import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Sparkles, 
  ExternalLink,
  Menu,
  X,
  KeyRound,
  ShieldCheck,
  Database,
  Clock,
  Wifi,
  WifiOff,
  ChevronRight
} from 'lucide-react';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';
import { AdminTeamSecurity } from './AdminTeamSecurity';
import { AdminLoginModal } from './AdminLoginModal';

const STATUS_META: Record<string, { en: string; km: string }> = {
  dashboard: { en: 'Boutique Overview', km: 'ទិដ្ឋភាពទូទៅហាង' },
  products: { en: 'Pearl Jewelry Inventory', km: 'ស្តុកគ្រឿងអលង្ការគុជខ្យង' },
  categories: { en: 'Product Categories', km: 'ប្រភេទទំនិញ' },
  orders: { en: 'Customer Order Inquiries', km: 'សំណួរកុម្ម៉ង់អតិថិជន' },
  customers: { en: 'VIP Clients & Customers', km: 'អតិថិជន VIP' },
  team: { en: 'Users & Security', km: 'អ្នកប្រើប្រាស់ និងសុវត្ថិភាព' },
  settings: { en: 'Store Settings', km: 'ការកំណត់ហាង' },
};

const ROLE_LABELS = {
  ADMIN: { en: 'Administrator', km: 'អ្នកគ្រប់គ្រង' },
  CUSTOMER: { en: 'Customer', km: 'អតិថិជន' },
} as const;

export const AdminLayout: React.FC = () => {
  const { isAdminLoggedIn, logoutAdmin, setCurrentPage, orders, currentUser, openChangePasswordModal, language, setLanguage, isDbConnected } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAdminLoggedIn) {
    return <AdminLoginModal />;
  }

  const pendingOrderCount = orders.filter(o => o.status === 'PENDING').length;
  const completedOrderCount = orders.filter(o => o.status === 'COMPLETED').length;
  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const navItems = [
    { id: 'dashboard', label: language === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង', icon: LayoutDashboard },
    { id: 'products', label: language === 'en' ? 'Products' : 'ផលិតផល', icon: Package },
    { id: 'categories', label: language === 'en' ? 'Categories' : 'ប្រភេទទំនិញ', icon: Layers },
    { id: 'orders', label: language === 'en' ? 'Customer Orders' : 'ការកុម្ម៉ង់អតិថិជន', icon: ShoppingBag, badge: pendingOrderCount },
    { id: 'customers', label: language === 'en' ? 'Customers (CRM)' : 'អតិថិជន (CRM)', icon: Users },
    { id: 'team', label: language === 'en' ? 'Users & Security' : 'អ្នកប្រើប្រាស់ និងសុវត្ថិភាព', icon: ShieldCheck },
    { id: 'settings', label: language === 'en' ? 'Store Settings' : 'ការកំណត់ហាង', icon: Settings },
  ];

  const locale = language === 'en' ? 'en-US' : 'km-KH';
  const numberFormatter = new Intl.NumberFormat(locale);
  const timeString = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: language === 'en' });
  const dateString = now.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });

  const renderLanguageSwitcher = () => (
    <div
      className="flex items-center gap-1 bg-[#3D2B05] rounded-lg p-1 border border-white/20 text-[10px]"
      aria-label={language === 'en' ? 'Language selection' : 'ការជ្រើសរើសភាសា'}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded transition-all ${
          language === 'en' ? 'bg-white text-[#523D0C] font-bold shadow-sm' : 'text-white/70 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('km')}
        className={`px-2 py-1 rounded transition-all ${
          language === 'km' ? 'bg-white text-[#523D0C] font-bold shadow-sm' : 'text-white/70 hover:text-white'
        }`}
      >
        ខ្មែរ
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#7B5B12] text-white flex flex-col md:flex-row relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(169,130,44,0.45)_0%,rgba(123,91,18,0)_70%)]" />
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#523B08]/95 backdrop-blur border-b border-white/20 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#3D2B05] border border-white/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif-luxury font-bold text-sm tracking-wider text-white">
            ប្រណិត <span className="text-white/70">ADMIN</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {renderLanguageSwitcher()}
          <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
            isDbConnected ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-400/40' : 'bg-amber-900/60 text-amber-200 border border-amber-400/40'
          }`}>
            {isDbConnected ? <Database className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isDbConnected ? (language === 'en' ? 'DB Live' : 'មូលដ្ឋានទិន្នន័យ') : (language === 'en' ? 'Local' : 'ក្នុងស្រុក')}
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-white/80 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:relative inset-y-0 left-0 z-40 w-64 bg-[#523B08]/95 backdrop-blur-md md:bg-[#523B08] border-r border-white/20 flex flex-col justify-between
        transform transition-transform duration-300
      `}>
          
          {/* Brand Top */}
          <div className="p-6 border-b border-white/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3D2B05] to-[#2A1D03] border border-white/40 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-display-luxury text-sm font-bold tracking-widest text-white">
                  ប្រណិត <span className="text-white/60">ADMIN</span>
                </div>
                <div className="text-[10px] text-white/80 tracking-wider uppercase font-semibold">
                  {language === 'en' ? 'PRANITH Boutique Suite' : 'ឈុតគ្រប់គ្រង PRANITH'}
                </div>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold px-3 pb-1.5 mt-1">
              {language === 'en' ? 'Management Console' : 'ផ្ទាំងគ្រប់គ្រង'}
            </div>
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-white text-[#523D0C] font-bold shadow-lg'
                      : 'text-white/80 hover:bg-[#3D2B05] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-amber-300"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : ''}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-amber-300 text-[#523D0C]' : 'bg-amber-400/90 text-[#523D0C]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold px-3 pb-1.5 pt-3">
              {language === 'en' ? 'Setup & Access' : 'ការកំណត់ និងសិទ្ធិ'}
            </div>
            {navItems.slice(5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-white text-[#523D0C] font-bold shadow-lg'
                      : 'text-white/80 hover:bg-[#3D2B05] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-amber-300"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer / Return to Store */}
          <div className="p-4 border-t border-white/20 space-y-2">
            {currentUser && (
              <div className="p-2.5 bg-[#3D2B05] rounded-xl border border-white/15 flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full bg-stone-900 border border-white/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[9px] text-amber-300 font-semibold uppercase">{ROLE_LABELS[currentUser.role][language]}</div>
                  </div>
                </div>

                <button
                  onClick={openChangePasswordModal}
                  title={language === 'en' ? 'Change My Password' : 'ផ្លាស់ប្តូរលេខសម្ងាត់របស់ខ្ញុំ'}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[10px] font-bold text-white/90 hover:bg-[#3D2B05] hover:text-white transition-colors border border-white/15"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Store' : 'ហាង'}</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[10px] font-bold text-rose-200 hover:bg-rose-900/60 hover:text-white transition-colors border border-white/15"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Sign Out' : 'ចាកចេញ'}</span>
              </button>
            </div>
          </div>

        </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/15 bg-[#523B08]/50 backdrop-blur-sm sticky top-0 z-30 gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/60 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'en' ? 'ប្រណិត (PRANITH) — Concierge Suite' : 'ប្រណិត (PRANITH) — ផ្នែកសេវាកម្ម'}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-amber-300">{STATUS_META[activeTab]?.[language] || ''}</span>
            </div>
            <h1 className="font-serif-luxury text-2xl font-bold text-white leading-tight">
              {STATUS_META[activeTab]?.[language] || ''}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {renderLanguageSwitcher()}

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3D2B05] border border-white/15 shadow-inner">
              <Clock className="w-4 h-4 text-amber-300" />
              <div className="leading-tight">
                <div className="font-mono text-sm font-bold text-white tabular-nums">{timeString}</div>
                <div className="text-[9px] text-white/60 uppercase tracking-wider font-semibold">{dateString}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3D2B05] border border-white/15 shadow-inner">
              {isDbConnected ? <Wifi className="w-4 h-4 text-emerald-300" /> : <WifiOff className="w-4 h-4 text-amber-300" />}
              <div className="leading-tight">
                <div className={`text-[11px] font-bold ${isDbConnected ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {isDbConnected ? (language === 'en' ? 'Neon PostgreSQL' : 'Neon PostgreSQL') : (language === 'en' ? 'Local Storage' : 'ការផ្ទុកក្នុងមូលដ្ឋាន')}
                </div>
                <div className="text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                  {isDbConnected ? (language === 'en' ? 'Synced' : 'បានធ្វើសមកាលកម្ម') : (language === 'en' ? 'Offline cache' : 'ឃ្លាំងក្រៅបណ្តាញ')}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 shadow-inner">
              <Database className="w-4 h-4 text-amber-200" />
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-white">
                  <span className="text-amber-300 font-mono">${numberFormatter.format(totalRevenue)}</span>
                </div>
                <div className="text-[9px] text-white/70 uppercase tracking-wider font-semibold">
                  {language === 'en' ? `${numberFormatter.format(completedOrderCount)} completed` : `${numberFormatter.format(completedOrderCount)} បានបញ្ចប់`}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1400px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'dashboard' && <AdminDashboardOverview setActiveTab={setActiveTab} />}
              {activeTab === 'products' && <AdminProducts />}
              {activeTab === 'categories' && <AdminCategories />}
              {activeTab === 'orders' && <AdminOrders />}
              {activeTab === 'customers' && <AdminCustomers />}
              {activeTab === 'team' && <AdminTeamSecurity />}
              {activeTab === 'settings' && <AdminSettings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};