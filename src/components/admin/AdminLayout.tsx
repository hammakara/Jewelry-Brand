import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  Sparkles, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';
import { AdminLoginModal } from './AdminLoginModal';

export const AdminLayout: React.FC = () => {
  const { isAdminLoggedIn, logoutAdmin, setCurrentPage, orders } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLoginModal />;
  }

  const pendingOrderCount = orders.filter(o => o.status === 'PENDING').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: pendingOrderCount },
    { id: 'customers', label: 'Customers (CRM)', icon: Users },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EE] flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#141414] border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A227]" />
          <span className="font-serif-luxury font-bold text-sm tracking-wider text-white">
            MAISON ADMIN
          </span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#111111] border-r border-gray-800/80 flex flex-col justify-between
        transform transition-transform duration-200 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand Top */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display-luxury text-sm font-bold tracking-widest text-[#F8F5EE]">
                MAISON ADMIN
              </div>
              <div className="text-[10px] text-[#C9A227] tracking-wider uppercase font-semibold">
                Boutique Suite
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#C9A227] text-[#0B0B0B] font-bold shadow-md'
                    : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-black text-[#E6C766]' : 'bg-amber-500 text-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / Return to Store */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-gray-300 hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#C9A227]" />
            <span>Live Boutique Store</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {activeTab === 'dashboard' && <AdminDashboardOverview setActiveTab={setActiveTab} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

    </div>
  );
};
