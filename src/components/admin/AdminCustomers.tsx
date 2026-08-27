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
          <p className="text-xs text-white/80">
            Maintain relationship history, order tallies, and direct contact details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80 font-medium">Total Clients:</span>
          <span className="px-3 py-1 bg-[#3D2B05] border border-white/30 text-white font-mono font-bold text-xs rounded-lg shadow-sm">
            {customers.length} Profiles
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#523B08] border border-white/20 p-4 rounded-2xl shadow-md">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, phone, telegram, or address..."
            className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/50 outline-none pl-9"
          />
          <Search className="w-4 h-4 text-white/60 absolute left-3 top-3" />
        </div>
      </div>

      {/* Customers Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => {
          const clientOrders = orders.filter(o => o.customerPhone === cust.phone || o.customerName === cust.name);

          return (
            <div
              key={cust.id}
              className="bg-[#523B08] border border-white/20 hover:border-white/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3D2B05] border border-white/40 flex items-center justify-center text-white font-bold text-sm">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-base font-bold text-white">{cust.name}</h4>
                      <span className="text-[10px] text-white/80 uppercase tracking-wider font-bold">
                        VIP Client
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-white">
                      ${cust.totalSpent.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-white/70">
                      {cust.orderCount ?? cust.ordersCount ?? 1} Orders
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
