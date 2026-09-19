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
  Sparkles,
  Activity,
  PieChart,
  Layers,
  Filter,
  ArrowUpRight,
  Wallet,
  Zap,
  Users
} from 'lucide-react';
import { OrderStatus } from '../../types';
import { 
  Sparkline, 
  DonutChart, 
  VerticalBarChart, 
  HorizontalBars, 
  Funnel, 
  AnalyticsCard 
} from './AdminCharts';

interface Props {
  setActiveTab: (tab: string) => void;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: '#FBBF24',
  CONTACTED: '#38BDF8',
  CONFIRMED: '#C084FC',
  COMPLETED: '#34D399',
  CANCELLED: '#FB7185',
};

const BAR_PALETTE = ['#FFDF79', '#FBBF24', '#38BDF8', '#C084FC', '#34D399', '#FB8785', '#A3E635'];

export const AdminDashboardOverview: React.FC<Props> = ({ setActiveTab }) => {
  const { products, orders, categories, updateOrderStatus, settings, language } = useStore();

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

  const activeOrders = orders.filter(o => o.status !== 'CANCELLED');
  const avgOrderValue = activeOrders.length > 0
    ? Math.round((activeOrders.reduce((a, o) => a + o.totalAmount, 0) / activeOrders.length) * 100) / 100
    : 0;

  const conversionTarget = orders.filter(o => o.status !== 'CANCELLED').length;
  const conversionRate = conversionTarget > 0
    ? Math.round((completedOrders / conversionTarget) * 100)
    : 0;

  const recentOrders = orders.slice(0, 5);

  /* ---- Analytics data derivation ---- */

  // Trailing 7-day window anchored on most recent order date
  const anchorMs = orders.length > 0
    ? Math.max(...orders.map(o => new Date(o.createdAt).getTime()))
    : Date.now();
  const base = new Date(anchorMs);
  base.setHours(0, 0, 0, 0);

  const dayLabels: string[] = [];
  const dayBuckets: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base.getTime() - i * 86400000);
    dayBuckets.push(d);
    dayLabels.push(d.toLocaleDateString(language === 'en' ? 'en-US' : 'km-KH', { weekday: 'short' }));
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const volumeByDay = dayBuckets.map(day => orders.filter(o => isSameDay(new Date(o.createdAt), day)).length);
  const newByDay = dayBuckets.map(day => orders.filter(o => isSameDay(new Date(o.createdAt), day) && o.status === 'PENDING').length);
  const pipelineByDay = dayBuckets.map(day => orders.filter(o => isSameDay(new Date(o.createdAt), day) && (o.status === 'CONTACTED' || o.status === 'CONFIRMED')).length);
  const doneByDay = dayBuckets.map(day => orders.filter(o => isSameDay(new Date(o.createdAt), day) && o.status === 'COMPLETED').length);

  // Products per category (for sparkline + distribution)
  const countsByCategory = categories.map(cat => products.filter(p => p.categoryId === cat.id).length);

  // Revenue by category (from completed orders routed through product catalog)
  const revenueByCategory = categories.map((cat, i) => {
    const revenue = orders
      .filter(o => o.status === 'COMPLETED')
      .filter(o => {
        const prod = products.find(p => p.id === o.productId);
        return prod ? prod.categoryId === cat.id : false;
      })
      .reduce((acc, o) => acc + o.totalAmount, 0);
    return {
      label: language === 'km' && cat.nameKhmer ? cat.nameKhmer : cat.name,
      value: revenue,
      color: BAR_PALETTE[i % BAR_PALETTE.length],
    };
  }).filter(d => d.value > 0);

  const unassignedRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .filter(o => {
      const prod = products.find(p => p.id === o.productId);
      return !prod;
    })
    .reduce((acc, o) => acc + o.totalAmount, 0);

  if (unassignedRevenue > 0) {
    revenueByCategory.push({
      label: language === 'en' ? 'Unassigned Items' : 'ទំនិញមិនកំណត់',
      value: unassignedRevenue,
      color: '#FFFFFF',
    });
  }

  // Status donut
  const statusSplit = (Object.keys(STATUS_COLORS) as OrderStatus[]).map((s) => {
    const count = orders.filter(o => o.status === s).length;
    return {
      label: s,
      value: count,
      color: STATUS_COLORS[s],
    };
  });

  // Conversion funnel
  const funnelSteps = [
    { label: language === 'en' ? 'Requests' : 'សំណើ', value: orders.length, color: '#FBBF24' },
    { label: language === 'en' ? 'Contacted' : 'បានទាក់ទង', value: orders.filter(o => ['CONTACTED', 'CONFIRMED', 'COMPLETED'].includes(o.status)).length, color: '#38BDF8' },
    { label: language === 'en' ? 'Confirmed' : 'បានបញ្ជាក់', value: orders.filter(o => ['CONFIRMED', 'COMPLETED'].includes(o.status)).length, color: '#C084FC' },
    { label: language === 'en' ? 'Completed' : 'បានបញ្ចប់', value: completedOrders, color: '#34D399' },
  ].filter(s => s.value > 0);

  const totalStatus = orders.length;

  const generateTelegramUrl = (telegram: string) => {
    const cleanUsername = telegram.replace('@', '').replace(/\s+/g, '');
    return `https://t.me/${cleanUsername}`;
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-br from-[#523B08] via-[#4A3406] to-[#3D2B05] border border-white/20 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/5 blur-2xl"></div>
        <div className="pointer-events-none absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-amber-300/5 blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? 'Maison Management Engine' : 'ម៉ាទ័រគ្រប់គ្រង Maison'}</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
            {language === 'en' ? 'Boutique Operations Overview' : 'ទិដ្ឋភាពទូទៅនៃប្រតិបត្តិការហាង'}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {language === 'en' ? 'Real-time pipeline of pearl inventory, customer order inquiries, and sales fulfillment.' : 'បន្ទរពេលវេលាពិតនៃស្តុកគុជខ្យង សំណើកុម្ម៉ង់អតិថិជន និងការបំពេញការលក់។'}
          </p>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Package className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '+ Add Product' : '+ បន្ថែមផលិតផល'}</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2.5 bg-[#3D2B05] hover:bg-[#322303] text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>{language === 'en' ? `View All Orders (${orders.length})` : `មើលកុម្ម៉ង់ទាំងអស់ (${orders.length})`}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Products */}
        <div 
          onClick={() => setActiveTab('products')}
          className="group bg-[#523B08] border border-white/20 hover:border-white/60 p-5 rounded-2xl cursor-pointer transition-all shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">{language === 'en' ? 'Total Products' : 'ផលិតផលសរុប'}</span>
            <div className="p-2 bg-[#3D2B05] rounded-lg text-white group-hover:bg-white group-hover:text-[#523D0C] transition-colors border border-white/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 mt-3">
            <div>
              <div className="text-3xl font-bold text-white font-mono">{totalProducts}</div>
              <div className="text-[11px] text-white/70 mt-1 font-medium">
                {language === 'en' ? `Across ${categories.length} categories` : `ក្នុង ${categories.length} ប្រភេទ`}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Sparkline data={countsByCategory.length ? countsByCategory : [0]} color="#FFDF79" width={80} height={28} />
              <span className="text-[9px] text-white/50 uppercase tracking-wider font-bold">by collection</span>
            </div>
          </div>
        </div>

        {/* New Requests */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="group bg-[#523B08] border border-amber-400/40 hover:border-amber-300 p-5 rounded-2xl cursor-pointer transition-all shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">{language === 'en' ? 'New Requests' : 'សំណើថ្មី'}</span>
            <div className="p-2 bg-amber-900/60 rounded-lg text-amber-200 group-hover:bg-amber-300 group-hover:text-[#523D0C] transition-colors border border-amber-400/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 mt-3">
            <div>
              <div className="text-3xl font-bold text-white font-mono">{newRequests}</div>
              <div className="text-[11px] text-amber-200 mt-1 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse inline-block"></span>
                {language === 'en' ? 'Requires contact' : 'ទាមទារការទំនាក់ទំនង'}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Sparkline data={newByDay} color="#FBBF24" width={80} height={28} />
              <span className="text-[9px] text-amber-200/60 uppercase tracking-wider font-bold">7-day trend</span>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="group bg-[#523B08] border border-sky-400/40 hover:border-sky-300 p-5 rounded-2xl cursor-pointer transition-all shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">{language === 'en' ? 'Pending Orders' : 'ការកុម្ម៉ង់កំពុងរង់ចាំ'}</span>
            <div className="p-2 bg-sky-900/60 rounded-lg text-sky-200 group-hover:bg-sky-300 group-hover:text-[#523D0C] transition-colors border border-sky-400/40">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 mt-3">
            <div>
              <div className="text-3xl font-bold text-white font-mono">{pendingOrders}</div>
              <div className="text-[11px] text-sky-200 mt-1 font-medium">{language === 'en' ? 'Contacted & confirmed' : 'បានទាក់ទង និងបានបញ្ជាក់'}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Sparkline data={pipelineByDay} color="#38BDF8" width={80} height={28} />
              <span className="text-[9px] text-sky-200/60 uppercase tracking-wider font-bold">7-day trend</span>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="group bg-[#523B08] border border-emerald-400/40 hover:border-emerald-300 p-5 rounded-2xl cursor-pointer transition-all shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{language === 'en' ? 'Completed Orders' : 'ការកុម្ម៉ង់បានបញ្ចប់'}</span>
            <div className="p-2 bg-emerald-900/60 rounded-lg text-emerald-200 group-hover:bg-emerald-300 group-hover:text-[#523D0C] transition-colors border border-emerald-400/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 mt-3">
            <div>
              <div className="text-3xl font-bold text-white font-mono">{completedOrders}</div>
              <div className="text-[11px] text-emerald-200 mt-1 font-medium">{language === 'en' ? `Revenue: $${totalRevenue.toLocaleString()}` : `ចំណូល៖ $${totalRevenue.toLocaleString()}`}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Sparkline data={doneByDay} color="#34D399" width={80} height={28} />
              <span className="text-[9px] text-emerald-200/60 uppercase tracking-wider font-bold">7-day trend</span>
            </div>
          </div>
        </div>

      </div>

      {/* Financial Pipeline Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-[#523B08] border border-white/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#3D2B05] to-[#2A1D03] text-white border border-white/25 shadow-inner">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-white/80 uppercase font-semibold">{language === 'en' ? 'Active Pipeline Gross Value' : 'តម្លៃសរុបនៃកុម្ម៉ង់សកម្ម'}</div>
              <div className="text-2xl font-bold text-white font-mono">
                ${pipelineValue.toLocaleString()} <span className="text-xs text-white/70 font-normal">USD (~{(pipelineValue * settings.exchangeRateKhr).toLocaleString()} KHR)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/80">
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1 justify-center sm:justify-end text-amber-200 font-bold">
                <Wallet className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'AOV' : 'AOV'}</span>
              </div>
              <div className="font-mono font-bold text-white">${avgOrderValue.toLocaleString()}</div>
              <div className="text-[10px] text-white/60">{language === 'en' ? 'avg / order' : 'ជាមធ្យម/កុម្ម៉ង់'}</div>
            </div>
            <div className="w-px h-10 bg-white/15 hidden sm:block"></div>
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1 justify-center sm:justify-end text-emerald-200 font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Conversion' : 'ការបំលែង'}</span>
              </div>
              <div className="font-mono font-bold text-white">{conversionRate}%</div>
              <div className="text-[10px] text-white/60">{language === 'en' ? 'request → completed' : 'សំណើ → បានបញ្ចប់'}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#523B08] border border-white/20 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-white/80 uppercase font-semibold">{language === 'en' ? 'Maintenance Plan' : 'គម្រោងថែទាំ'}</div>
            <div className="text-lg font-bold text-emerald-300 mt-0.5">{language === 'en' ? '$15/mo active' : '$15/ខែ សកម្ម'}</div>
            <div className="text-[11px] text-white/60 mt-1">{language === 'en' ? 'Neon PostgreSQL Schema Synced' : 'Neon PostgreSQL បានធ្វើសមកាលកម្ម'}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-900/40 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Revenue by Collection */}
        <AnalyticsCard
          title={language === 'en' ? 'Revenue by Collection' : 'ចំណូលតាមបណ្តុំ'}
          subtitle={language === 'en' ? 'Completed order value routed through catalog categories' : 'តម្លៃកុម្ម៉ង់បានបញ្ចប់ តាមប្រភេទកាតាឡុក'}
          icon={<Layers className="w-4 h-4" />}
          right={<span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">${totalRevenue.toLocaleString()}</span>}
        >
          {revenueByCategory.length > 0 ? (
            <HorizontalBars data={revenueByCategory} prefix="$" />
          ) : (
            <div className="text-center text-white/50 text-xs py-8">{language === 'en' ? 'No completed revenue to display yet.' : 'មិនទាន់មានចំណូលដែលបានបញ្ចប់ឡើយ។'}</div>
          )}
        </AnalyticsCard>

        {/* Order Status Donut */}
        <AnalyticsCard
          title={language === 'en' ? 'Order Pipeline Split' : 'ការវិភាគបន្ទរកុម្ម៉ង់'}
          subtitle={language === 'en' ? 'Distribution of all inquiries by status' : 'ការចែកចាយសំណើទាំងអស់តាមស្ថានភាព'}
          icon={<PieChart className="w-4 h-4" />}
          right={<span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{totalStatus} total</span>}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              data={statusSplit}
              centerLabel={String(totalStatus)}
              centerSub={language === 'en' ? 'Inquiries' : 'សំណើ'}
            />
            <div className="flex-1 w-full grid grid-cols-1 gap-2">
              {statusSplit.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }}></span>
                    <span className="text-white/85 font-semibold uppercase tracking-wider text-[10px]">
                      {language === 'en'
                        ? s.label
                        : s.label === 'PENDING' ? 'រង់ចាំ'
                          : s.label === 'CONTACTED' ? 'បានទាក់ទង'
                            : s.label === 'CONFIRMED' ? 'បានបញ្ជាក់'
                              : s.label === 'COMPLETED' ? 'បានបញ្ចប់'
                                : 'បានលុបចោល'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsCard>

        {/* 7-Day Volume */}
        <AnalyticsCard
          title={language === 'en' ? 'Inquiry Volume (7 days)' : 'បរិមាណសំណើ (7 ថ្ងៃ)'}
          subtitle={language === 'en' ? `Latest ${volumeByDay.reduce((a, b) => a + b, 0)} inquiries across the trailing week` : `សំណើ ${volumeByDay.reduce((a, b) => a + b, 0)} ចុងក្រោយក្នុងរយៈពេល ៧ ថ្ងៃ`}
          icon={<Activity className="w-4 h-4" />}
          right={<span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider"><ArrowUpRight className="w-3.5 h-3.5" /> live</span>}
        >
          <VerticalBarChart
            data={dayLabels.map((label, i) => ({ label, value: volumeByDay[i] }))}
            color="rgba(255,223,121,0.85)"
            height={140}
          />
        </AnalyticsCard>

        {/* Conversion Funnel */}
        <AnalyticsCard
          title={language === 'en' ? 'Concierge Conversion Funnel' : 'លំហូរការបំលែងសេវាកម្ម'}
          subtitle={language === 'en' ? 'Request → contact → confirm → complete' : 'សំណើ → ទាក់ទង → បញ្ជាក់ → បញ្ចប់'}
          icon={<Filter className="w-4 h-4" />}
          right={
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              {conversionRate}% overall
            </span>
          }
        >
          {funnelSteps.length > 0 ? (
            <Funnel steps={funnelSteps} />
          ) : (
            <div className="text-center text-white/50 text-xs py-8">{language === 'en' ? 'No pipeline data yet.' : 'មិនទាន់មានទិន្នន័យបន្ទរឡើយ។'}</div>
          )}
        </AnalyticsCard>

      </div>

      {/* Recent Orders Live Stream */}
      <div className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              {language === 'en' ? 'Recent Order Requests' : 'ការស្នើសុំកុម្ម៉ង់ថ្មីៗ'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs text-amber-300 underline hover:text-white font-bold"
          >
            {language === 'en' ? `Manage All (${orders.length})` : `គ្រប់គ្រងទាំងអស់ (${orders.length})`} &rarr;
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
                    <span className="font-mono text-xs font-bold text-amber-200">#{order.id}</span>
                    <span className="text-xs text-white/60">&bull; {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate">{order.productName}</h4>
                  <div className="text-xs text-white/75">
                    {language === 'en' ? `Qty: ${order.quantity}` : `ចំនួន: ${order.quantity}`} &bull; <strong className="text-white">${order.totalAmount}</strong>
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
                  <option value="PENDING">{language === 'en' ? 'PENDING' : 'កំពុងរង់ចាំ'}</option>
                  <option value="CONTACTED">{language === 'en' ? 'CONTACTED' : 'បានទាក់ទង'}</option>
                  <option value="CONFIRMED">{language === 'en' ? 'CONFIRMED' : 'បានបញ្ជាក់'}</option>
                  <option value="COMPLETED">{language === 'en' ? 'COMPLETED' : 'បានបញ្ចប់'}</option>
                  <option value="CANCELLED">{language === 'en' ? 'CANCELLED' : 'បានលុបចោល'}</option>
                </select>

                {/* Direct Telegram click */}
                {order.customerTelegram && (
                  <a
                    href={generateTelegramUrl(order.customerTelegram)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded-lg border border-white/20 transition-colors shadow-sm"
                    title={language === 'en' ? 'Open Telegram Chat with Customer' : 'បើកការជជែក Telegram ជាមួយអតិថិជន'}
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}

                {/* Direct phone call */}
                <a
                  href={`tel:${order.customerPhone}`}
                  className="p-2 bg-[#3D2B05] hover:bg-emerald-600 hover:text-white text-white rounded-lg border border-white/20 transition-colors shadow-sm"
                  title={language === 'en' ? 'Call Customer' : 'ទូរស័ព្ទទៅអតិថិជន'}
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