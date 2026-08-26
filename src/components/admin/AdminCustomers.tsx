import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Send, Phone, UserCheck, Star, Sparkles, MapPin } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, orders } = useStore();
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

  const generateTelegramUrl = (telegram: string) => {
    const cleanUsername = telegram.replace('@', '').replace(/\s+/g, '');
    return `https://t.me/${cleanUsername}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            VIP Clients & Customers Directory
          </h2>
          <p className="text-xs text-gray-400">
            Maintain relationship history, order tallies, and direct contact details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Total Clients:</span>
          <span className="px-3 py-1 bg-[#1C1C1C] border border-[#C9A227]/40 text-[#E6C766] font-mono font-bold text-xs rounded">
            {customers.length} Profiles
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#141414] border border-gray-800 p-4 rounded-xl">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, phone, telegram, or address..."
            className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none pl-9"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Customers Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => {
          const clientOrders = orders.filter(o => o.customerPhone === cust.phone || o.customerName === cust.name);

          return (
            <div
              key={cust.id}
              className="bg-[#141414] border border-gray-800 hover:border-[#C9A227]/40 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 border border-[#C9A227] flex items-center justify-center text-[#E6C766] font-bold text-sm">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-base font-bold text-white">{cust.name}</h4>
                      <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold">
                        VIP Client
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-[#E6C766]">
                      ${cust.totalSpent.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {cust.orderCount ?? cust.ordersCount ?? 1} Orders
                    </div>
                  </div>
                </div>

                {/* Contact items */}
                <div className="text-xs text-gray-300 space-y-1.5 pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <a href={`tel:${cust.phone}`} className="hover:underline text-gray-200">
                      {cust.phone}
                    </a>
                  </div>

                  {cust.telegram && (
                    <div className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-[#C9A227]" />
                      <a
                        href={generateTelegramUrl(cust.telegram)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#E6C766] hover:underline"
                      >
                        {cust.telegram}
                      </a>
                    </div>
                  )}

                  {cust.address && (
                    <div className="flex items-start gap-2 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{cust.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                {cust.telegram && (
                  <a
                    href={generateTelegramUrl(cust.telegram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black text-[#E6C766] text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                )}

                <a
                  href={`tel:${cust.phone}`}
                  className="flex-1 py-2 bg-[#1C1C1C] hover:bg-emerald-600 hover:text-white text-gray-300 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
