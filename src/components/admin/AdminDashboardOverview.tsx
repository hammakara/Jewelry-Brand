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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] border border-[#C9A227]/30 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#C9A227]">
            <Sparkles className="w-4 h-4" />
            <span>Maison Management Engine</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
            Boutique Operations Overview
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time pipeline of pearl inventory, customer order inquiries, and sales fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] text-white border border-gray-700 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>View All Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards (Matching User Prompt Section 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Products */}
        <div 
          onClick={() => setActiveTab('products')}
          className="bg-[#141414] border border-gray-800 hover:border-[#C9A227]/50 p-5 rounded-xl cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Products</span>
            <div className="p-2 bg-[#1C1C1C] rounded text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0B0B0B] transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-3">{totalProducts}</div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
            <span>Across {categories.length} categories</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
        </div>

        {/* New Requests */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-[#141414] border border-amber-900/40 hover:border-amber-500/60 p-5 rounded-xl cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">New Requests</span>
            <div className="p-2 bg-amber-950/60 rounded text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-300 font-mono mt-3">{newRequests}</div>
          <div className="text-[11px] text-amber-400/80 mt-1 flex items-center justify-between">
            <span>Requires customer contact</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
        </div>

        {/* Pending Orders (In contact / confirmed) */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-[#141414] border border-sky-900/40 hover:border-sky-500/60 p-5 rounded-xl cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Pending Orders</span>
            <div className="p-2 bg-sky-950/60 rounded text-sky-400 group-hover:bg-sky-500 group-hover:text-black transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-sky-300 font-mono mt-3">{pendingOrders}</div>
          <div className="text-[11px] text-sky-400/80 mt-1">
            Contacted & confirmed
          </div>
        </div>

        {/* Completed Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-[#141414] border border-emerald-900/40 hover:border-emerald-500/60 p-5 rounded-xl cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Completed Orders</span>
            <div className="p-2 bg-emerald-950/60 rounded text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-300 font-mono mt-3">{completedOrders}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Revenue: ${totalRevenue.toLocaleString()}
          </div>
        </div>

      </div>

      {/* Financial Pipeline Indicator */}
      <div className="bg-[#141414] border border-gray-800 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Active Pipeline Gross Value</div>
            <div className="text-2xl font-bold text-[#E6C766] font-mono">
              ${pipelineValue.toLocaleString()} <span className="text-xs text-gray-500 font-normal">USD (~{(pipelineValue * settings.exchangeRateKhr).toLocaleString()} KHR)</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-right">
          <div>Maintenance Plan: <strong className="text-emerald-400">$15/mo active</strong></div>
          <div className="text-[11px] text-gray-500">Database: Neon PostgreSQL Schema Synced</div>
        </div>
      </div>

      {/* Recent Orders Live Stream */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C9A227]" />
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Recent Order Requests
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs text-[#C9A227] hover:underline font-semibold"
          >
            Manage All ({orders.length}) &rarr;
          </button>
        </div>

        <div className="divide-y divide-gray-800/80">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-4 sm:p-5 hover:bg-[#1A1A1A] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-12 h-12 rounded object-cover border border-[#C9A227]/30 bg-black shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#E6C766]">#{order.id}</span>
                    <span className="text-xs text-gray-400">&bull; {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-medium text-sm text-white truncate">{order.productName}</h4>
                  <div className="text-xs text-gray-400">
                    Qty: {order.quantity} &bull; <strong className="text-white">${order.totalAmount}</strong>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-xs text-gray-300 space-y-0.5 sm:border-l sm:border-gray-800 sm:pl-4">
                <div className="font-semibold text-white">{order.customerName}</div>
                <div className="text-gray-400">{order.customerPhone}</div>
                <div className="text-[#C9A227]">{order.customerTelegram}</div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 sm:self-center">
                
                {/* Status selector */}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded outline-none cursor-pointer border ${
                    order.status === 'PENDING'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                      : order.status === 'CONTACTED'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-600'
                      : order.status === 'CONFIRMED'
                      ? 'bg-purple-950/80 text-purple-300 border-purple-600'
                      : order.status === 'COMPLETED'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      : 'bg-rose-950/80 text-rose-300 border-rose-600'
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
                    className="p-1.5 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black text-[#E6C766] rounded border border-gray-700 transition-colors"
                    title="Open Telegram Chat with Customer"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}

                {/* Direct phone call */}
                <a
                  href={`tel:${order.customerPhone}`}
                  className="p-1.5 bg-[#1C1C1C] hover:bg-emerald-600 hover:text-white text-gray-300 rounded border border-gray-700 transition-colors"
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
