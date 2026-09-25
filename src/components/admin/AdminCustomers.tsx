import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Send, Phone, Star, Sparkles, MapPin, Crown, Gem } from 'lucide-react';
import { Customer } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { customers, orders, language } = useStore();
  const locale = language === 'en' ? 'en-US' : 'km-KH';
  const numberFormatter = new Intl.NumberFormat(locale);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.telegram.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  // Sort: VIP tier desc, then spend desc
  const sortedCustomers = [...filteredCustomers].sort((a, b) => b.totalSpent - a.totalSpent);

  const generateTelegramUrl = (telegram: string) => {
    const cleanUsername = telegram.replace('@', '').replace(/\s+/g, '');
    return `https://t.me/${cleanUsername}`;
  };

  const getTier = (c: Customer) => {
    const spent = c.totalSpent;
    const ordersCount = c.orderCount ?? c.ordersCount ?? 1;
    if (spent >= 2000 || ordersCount >= 5) {
      return { label: language === 'en' ? 'Diamond' : 'ពេជ្រ', color: 'bg-sky-100 text-sky-900', icon: Gem };
    }
    if (spent >= 800 || ordersCount >= 3) {
      return { label: language === 'en' ? 'Gold' : 'មាស', color: 'bg-amber-300 text-stone-900', icon: Crown };
    }
    if (spent >= 300) {
      return { label: language === 'en' ? 'Silver' : 'ប្រាក់', color: 'bg-slate-200 text-slate-800', icon: Star };
    }
    return { label: language === 'en' ? 'Member' : 'សមាជិក', color: 'bg-white/20 text-white', icon: Star };
  };

  const topCustomer = sortedCustomers[0];
  const totalSpend = sortedCustomers.reduce((a, c) => a + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            {language === 'en' ? 'VIP Clients & Customers Directory' : 'បញ្ជីអតិថិជន VIP'}
          </h2>
          <p className="text-xs text-white/80">
            {language === 'en' ? 'Maintain relationship history, order tallies, and direct contact details.' : 'ថែរក្សាប្រវត្តិទំនាក់ទំនង រាប់កុម្ម៉ង់ និងព័ត៌មានទាក់ទងដោយផ្ទាល់។'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {topCustomer && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-white text-xs rounded-lg shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <strong className="font-bold">{topCustomer.name}</strong>
            </span>
          )}
          <span className="px-3 py-1 bg-[#3D2B05] border border-white/30 text-white font-mono font-bold text-xs rounded-lg shadow-sm">
            {numberFormatter.format(customers.length)} {language === 'en' ? 'Profiles' : 'ប្រវត្តិរូប'}
          </span>
        </div>
      </div>

      {/* Search + Stats strip */}
      <div className="bg-[#523B08] border border-white/20 p-4 rounded-2xl shadow-md space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search clients by name, phone, telegram, or address...' : 'ស្វែងរកអតិថិជនដោយឈ្មោះ, ទូរស័ព្ទ, telegram, ឬអាសយដ្ឋាន...'}
            className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/50 outline-none pl-9"
          />
          <Search className="w-4 h-4 text-white/60 absolute left-3 top-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center sm:text-left">
          <div className="px-3 py-2 bg-[#3D2B05] border border-white/15 rounded-lg">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold">{language === 'en' ? 'Portfolio Value' : 'តម្លៃផលប័ត្រ'}</div>
            <div className="font-mono font-bold text-white">${numberFormatter.format(totalSpend)}</div>
          </div>
          <div className="px-3 py-2 bg-[#3D2B05] border border-white/15 rounded-lg">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold">{language === 'en' ? 'Avg. Client Value' : 'តម្លៃអតិថិជនជាមធ្យម'}</div>
            <div className="font-mono font-bold text-white">${numberFormatter.format(customers.length ? Math.round((totalSpend / customers.length) * 100) / 100 : 0)}</div>
          </div>
          <div className="px-3 py-2 bg-[#3D2B05] border border-white/15 rounded-lg">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold">{language === 'en' ? 'Lifetime Orders' : 'កុម្ម៉ង់សរុប'}</div>
            <div className="font-mono font-bold text-white">{sortedCustomers.reduce((a, c) => a + (c.orderCount ?? c.ordersCount ?? 1), 0)}</div>
          </div>
        </div>
      </div>

      {/* Customers Cards / Table */}
      {sortedCustomers.length === 0 ? (
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-10 text-center shadow-xl">
          <div className="text-white/40 mb-2"><Sparkles className="w-8 h-8 mx-auto" /></div>
          <p className="text-white/70 text-sm">{language === 'en' ? 'No clients match your search.' : 'គ្មានអតិថិជនផ្គូផ្គងនឹងការស្វែងរករបស់អ្នកទេ។'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCustomers.map((cust) => {
            const clientOrders = orders.filter(o => o.customerPhone === cust.phone || o.customerName === cust.name);
            const tier = getTier(cust);
            const TierIcon = tier.icon;

            return (
              <div
                key={cust.id}
                className="bg-[#523B08] border border-white/20 hover:border-white/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:shadow-2xl hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3D2B05] to-[#2A1D03] border border-white/40 flex items-center justify-center text-white font-bold text-sm">
                          {cust.name.charAt(0)}
                        </div>
                        <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full border border-[#523B08] flex items-center justify-center ${tier.color}`}>
                          <TierIcon className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif-luxury text-base font-bold text-white">{cust.name}</h4>
                        <span className={`inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${tier.color}`}>
                          {tier.label} {language === 'en' ? 'Client' : 'អតិថិជន'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-amber-200">
                        ${numberFormatter.format(cust.totalSpent)}
                      </div>
                      <div className="text-[10px] text-white/70">
                        {cust.orderCount ?? cust.ordersCount ?? 1} {language === 'en' ? 'Orders' : 'ការកុម្ម៉ង់'}
                      </div>
                    </div>
                  </div>

                  {/* Contact items */}
                  <div className="text-xs text-white/90 space-y-1.5 pt-2 border-t border-white/15">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-white" />
                      <a href={`tel:${cust.phone}`} className="hover:underline text-white font-medium">
                        {cust.phone}
                      </a>
                    </div>

                    {cust.telegram && (
                      <div className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5 text-white" />
                        <a
                          href={generateTelegramUrl(cust.telegram)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white hover:underline font-medium"
                        >
                          {cust.telegram}
                        </a>
                      </div>
                    )}

                    {cust.address && (
                      <div className="flex items-start gap-2 text-white/70">
                        <MapPin className="w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cust.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/15">
                  {cust.telegram && (
                    <a
                      href={generateTelegramUrl(cust.telegram)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </a>
                  )}

                  <a
                    href={`tel:${cust.phone}`}
                    className="flex-1 py-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Call' : 'ទូរស័ព្ទ'}</span>
                  </a>

                  <span className="text-[9px] text-white/40 font-mono shrink-0">{clientOrders.length || '—'}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};