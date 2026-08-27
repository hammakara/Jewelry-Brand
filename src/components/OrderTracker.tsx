import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  PhoneCall, 
  Send, 
  PackageCheck, 
  Sparkles, 
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { OrderRequest, OrderStatus } from '../types';

export const OrderTracker: React.FC = () => {
  const { orders, settings, language, setCurrentPage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase().replace('#', '');
    if (!query) return;

    setHasSearched(true);
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.customerPhone.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        o.customerTelegram.toLowerCase().includes(query)
    );
    setSearchedOrder(found || null);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONTACTED':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'COMPLETED':
        return 3;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'PENDING', titleKhmer: 'រង់ចាំពិនិត្យ', desc: 'Order request received in boutique system' },
    { title: 'CONTACTED', titleKhmer: 'បានទាក់ទង', desc: 'Concierge reached out via Telegram/Phone' },
    { title: 'CONFIRMED', titleKhmer: 'បានបញ្ជាក់', desc: 'Order details verified & packaging prepared' },
    { title: 'COMPLETED', titleKhmer: 'បានបញ្ចប់', desc: 'Delivered in luxury velvet box with certificate' },
  ];

  return (
    <div className="min-h-screen bg-[#7B5B12] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#523B08] border border-white/20 text-white text-xs font-bold tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>{language === 'en' ? 'Live Order Lookup' : 'តាមដានស្ថានភាពការកុម្ម៉ង់'}</span>
          </div>
          
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
            {language === 'en' ? 'Track Your Order Request' : 'ពិនិត្យមើលស្ថានភាពទំនិញរបស់អ្នក'}
          </h1>
          <p className="text-sm text-white/80 max-w-lg mx-auto">
            {language === 'en'
              ? 'Enter your Order Reference ID (e.g. PRL-8942) or the phone number you used when placing the request.'
              : 'សូមបញ្ចូលលេខកូដសម្គាល់ការកុម្ម៉ង់ (ឧ. PRL-8942) ឬលេខទូរស័ព្ទដែលអ្នកបានប្រើពេលកុម្ម៉ង់។'}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. PRL-8942 or 012 889 922"
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-4 py-3.5 text-sm text-white placeholder-white/50 outline-none transition-all pl-10"
              />
              <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-4" />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{language === 'en' ? 'Search Status' : 'ស្វែងរក'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#523D0C]" />
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span>Demo sample IDs to test:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.id);
                  setHasSearched(true);
                  setSearchedOrder(o);
                }}
                className="px-2.5 py-1 bg-[#3D2B05] hover:bg-white text-white hover:text-[#523D0C] rounded-md border border-white/20 font-mono text-[11px] transition-colors"
              >
                #{o.id} ({o.status})
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          searchedOrder ? (
            <div className="bg-[#523B08] border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70">Order ID:</span>
                    <span className="font-mono text-lg font-bold text-white tracking-wider">
                      #{searchedOrder.id}
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    Placed on: {new Date(searchedOrder.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3D2B05] border border-white/20 text-white text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-white/70">Status: </span>
                  <span className="text-white font-bold">{searchedOrder.status}</span>
                </div>
              </div>

              {/* Progress Pipeline */}
              {searchedOrder.status !== 'CANCELLED' ? (
                <div className="py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                    {steps.map((step, idx) => {
                      const currentIdx = getStatusStepIndex(searchedOrder.status);
                      const isDone = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step.title}
                          className={`p-3.5 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-white text-[#523D0C] border-white shadow-lg font-bold'
                              : isDone
                              ? 'bg-[#3D2B05] text-white border-white/40'
                              : 'bg-[#352504] text-white/40 border-white/10'
                          }`}
                        >
                          <div className="flex justify-center mb-1">
                            {isDone ? (
                              <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-[#523D0C]' : 'text-white'}`} />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-white/30"></div>
                            )}
                          </div>
                          <div className="text-xs font-bold tracking-wider">
                            {language === 'km' ? step.titleKhmer : step.title}
                          </div>
                          <div className={`text-[10px] mt-1 line-clamp-2 ${isCurrent ? 'text-[#523D0C]/80' : 'text-white/70'}`}>
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-rose-900/60 border border-rose-400 p-4 rounded-xl flex items-center gap-3 text-white text-xs">
                  <XCircle className="w-5 h-5 text-rose-300 shrink-0" />
                  <span>This order request was marked as cancelled. Please contact our concierge if you wish to reinstate it.</span>
                </div>
              )}

              {/* Product & Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#3D2B05] p-5 rounded-xl border border-white/20">
                <div className="flex gap-3 items-center">
                  <img
                    src={searchedOrder.productImage}
                    alt={searchedOrder.productName}
                    className="w-16 h-16 object-cover rounded-lg border border-white/30 bg-[#2C1E03]"
                  />
                  <div>
                    <h4 className="font-serif-luxury font-bold text-sm text-white line-clamp-1">
                      {searchedOrder.productName}
                    </h4>
                    <div className="text-xs text-white/70">
                      {searchedOrder.pearlType} Pearl &bull; Qty: {searchedOrder.quantity}
                    </div>
                    <div className="text-base font-bold text-white mt-1">
                      ${searchedOrder.totalAmount}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-white/85 space-y-1 sm:border-l sm:border-white/15 sm:pl-5">
                  <div><strong className="text-white">Customer:</strong> {searchedOrder.customerName}</div>
                  <div><strong className="text-white">Phone:</strong> {searchedOrder.customerPhone}</div>
                  <div><strong className="text-white">Telegram:</strong> {searchedOrder.customerTelegram}</div>
                  <div><strong className="text-white">Address:</strong> {searchedOrder.customerAddress}, {searchedOrder.customerCity}</div>
                  {searchedOrder.notes && (
                    <div className="italic text-white/75 pt-1">"{searchedOrder.notes}"</div>
                  )}
                </div>
              </div>

              {/* Concierge Action Links */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={settings.telegramGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-1/2 py-3 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chat with Concierge</span>
                </a>

                <a
                  href={`tel:${settings.hotline}`}
                  className="w-full sm:w-1/2 py-3 bg-[#3D2B05] border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-white" />
                  <span>Call Hotline ({settings.hotline})</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="bg-[#523B08] border border-white/20 rounded-2xl p-8 text-center space-y-3 shadow-xl">
              <AlertCircle className="w-8 h-8 text-amber-300 mx-auto" />
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                No Order Request Found
              </h3>
              <p className="text-xs text-white/80 max-w-sm mx-auto">
                We couldn't find an order matching "{searchQuery}". Please check your order ID or phone number, or reach out to our concierge directly.
              </p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="mt-2 text-xs font-bold text-white underline hover:text-white/80"
              >
                Browse Pearl Collections &rarr;
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
};
