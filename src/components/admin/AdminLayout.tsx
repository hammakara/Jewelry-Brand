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
    <div className="min-h-screen bg-[#7B5B12] text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#523B08] border-b border-white/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="font-serif-luxury font-bold text-sm tracking-wider text-white">
            ប្រណិត ADMIN
          </span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-white/80 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#523B08] border-r border-white/20 flex flex-col justify-between
        transform transition-transform duration-200 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand Top */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3D2B05] border border-white/40 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display-luxury text-sm font-bold tracking-widest text-white">
                ប្រណិត ADMIN
              </div>
              <div className="text-[10px] text-white/80 tracking-wider uppercase font-semibold">
                PRANITH Boutique Suite
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
                    ? 'bg-white text-[#523D0C] font-bold shadow-md'
                    : 'text-white/80 hover:bg-[#3D2B05] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#523D0C] text-white' : 'bg-white text-[#523D0C]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / Return to Store */}
        <div className="p-4 border-t border-white/20 space-y-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-white/90 hover:bg-[#3D2B05] hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-white" />
            <span>Live Boutique Store</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-200 hover:bg-rose-900/60 hover:text-white transition-colors"
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
