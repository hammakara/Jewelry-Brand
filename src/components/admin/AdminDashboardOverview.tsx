import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Send, 
  Phone, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { OrderStatus } from '../../types';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<Props> = ({ setActiveTab }) => {
  const { products, orders, categories, customers, updateOrderStatus, settings } = useStore();

  const totalProducts = products.length;
  const newRequests = orders.filter(o => o.status === 'PENDING').length;
  const pendingOrders = orders.filter(o => o.status === 'CONTACTED' || o.status === 'CONFIRMED').length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;

  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pipelineValue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const recentOrders = orders.slice(0, 5);

  const generateTelegramUrl = (telegram: string, orderId: string) => {
    const cleanUsername = telegram.replace('@', '').replace(/\s+/g, '');
    return `https://t.me/${cleanUsername}`;
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#523B08] border border-white/20 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-white/90">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Maison Management Engine</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
            Boutique Operations Overview
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Real-time pipeline of pearl inventory, customer order inquiries, and sales fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Package className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2.5 bg-[#3D2B05] hover:bg-[#322303] text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>View All Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Products */}
        <div 
          onClick={() => setActiveTab('products')}
          className="bg-[#523B08] border border-white/20 hover:border-white p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">Total Products</span>
            <div className="p-2 bg-[#3D2B05] rounded-lg text-white group-hover:bg-white group-hover:text-[#523D0C] transition-colors border border-white/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-3">{totalProducts}</div>
          <div className="text-[11px] text-white/70 mt-1 flex items-center justify-between">
            <span>Across {categories.length} categories</span>
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* New Requests */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-[#523B08] border border-amber-400/40 hover:border-amber-300 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">New Requests</span>
            <div className="p-2 bg-amber-900/60 rounded-lg text-amber-200 group-hover:bg-amber-300 group-hover:text-[#523D0C] transition-colors border border-amber-400/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-3">{newRequests}</div>
          <div className="text-[11px] text-amber-200 mt-1 flex items-center justify-between font-medium">
            <span>Requires customer contact</span>
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
          </div>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-[#523B08] border border-sky-400/40 hover:border-sky-300 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Pending Orders</span>
            <div className="p-2 bg-sky-900/60 rounded-lg text-sky-200 group-hover:bg-sky-300 group-hover:text-[#523D0C] transition-colors border border-sky-400/40">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-3">{pendingOrders}</div>
          <div className="text-[11px] text-sky-200 mt-1 font-medium">
            Contacted & confirmed
          </div>
        </div>

        {/* Completed Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-[#523B08] border border-emerald-400/40 hover:border-emerald-300 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Completed Orders</span>
            <div className="p-2 bg-emerald-900/60 rounded-lg text-emerald-200 group-hover:bg-emerald-300 group-hover:text-[#523D0C] transition-colors border border-emerald-400/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-3">{completedOrders}</div>
          <div className="text-[11px] text-emerald-200 mt-1 font-medium">
            Revenue: ${totalRevenue.toLocaleString()}
          </div>
        </div>

      </div>

      {/* Financial Pipeline Indicator */}
      <div className="bg-[#523B08] border border-white/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#3D2B05] text-white border border-white/25 shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-white/80 uppercase font-semibold">Active Pipeline Gross Value</div>
            <div className="text-2xl font-bold text-white font-mono">
              ${pipelineValue.toLocaleString()} <span className="text-xs text-white/70 font-normal">USD (~{(pipelineValue * settings.exchangeRateKhr).toLocaleString()} KHR)</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/80 text-right">
          <div>Maintenance Plan: <strong className="text-emerald-300 font-bold">$15/mo active</strong></div>
          <div className="text-[11px] text-white/60">Database: Neon PostgreSQL Schema Synced</div>
        </div>
      </div>

      {/* Recent Orders Live Stream */}
      <div className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Recent Order Requests
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs text-white underline hover:text-white/80 font-bold"
          >
            Manage All ({orders.length}) &rarr;
          </button>
        </div>

        <div className="divide-y divide-white/10">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-4 sm:p-5 hover:bg-[#442F05] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-12 h-12 rounded-lg object-cover border border-white/30 bg-[#352504] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">#{order.id}</span>
                    <span className="text-xs text-white/60">&bull; {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate">{order.productName}</h4>
                  <div className="text-xs text-white/75">
                    Qty: {order.quantity} &bull; <strong className="text-white">${order.totalAmount}</strong>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-xs text-white/85 space-y-0.5 sm:border-l sm:border-white/15 sm:pl-4">
                <div className="font-bold text-white">{order.customerName}</div>
                <div className="text-white/75">{order.customerPhone}</div>
                <div className="text-white font-medium">{order.customerTelegram}</div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 sm:self-center">
                
                {/* Status selector */}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border ${
                    order.status === 'PENDING'
                      ? 'bg-amber-900/90 text-amber-200 border-amber-400'
                      : order.status === 'CONTACTED'
                      ? 'bg-sky-900/90 text-sky-200 border-sky-400'
                      : order.status === 'CONFIRMED'
                      ? 'bg-purple-900/90 text-purple-200 border-purple-400'
                      : order.status === 'COMPLETED'
                      ? 'bg-emerald-900/90 text-emerald-200 border-emerald-400'
                      : 'bg-rose-900/90 text-rose-200 border-rose-400'
                  }`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                {/* Direct Telegram click */}
                {order.customerTelegram && (
                  <a
                    href={generateTelegramUrl(order.customerTelegram, order.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded-lg border border-white/20 transition-colors shadow-sm"
                    title="Open Telegram Chat with Customer"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}

                {/* Direct phone call */}
                <a
                  href={`tel:${order.customerPhone}`}
                  className="p-2 bg-[#3D2B05] hover:bg-emerald-600 hover:text-white text-white rounded-lg border border-white/20 transition-colors shadow-sm"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
