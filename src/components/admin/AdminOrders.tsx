import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Send, 
  Phone, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  X, 
  Edit3, 
  MapPin, 
  FileText, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { OrderRequest, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderAdminNotes, deleteOrder, settings } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [editingAdminNotes, setEditingAdminNotes] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.customerTelegram.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openOrderDetail = (order: OrderRequest) => {
    setSelectedOrder(order);
    setEditingAdminNotes(order.adminNotes || '');
  };

  const handleSaveNotes = () => {
    if (selectedOrder) {
      updateOrderAdminNotes(selectedOrder.id, editingAdminNotes);
      setSelectedOrder({ ...selectedOrder, adminNotes: editingAdminNotes });
    }
  };

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
            Customer Order Inquiries
          </h2>
          <p className="text-xs text-white/80">
            Fulfill "Contact to Order" requests, change pipeline statuses, and record boutique notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80 font-medium">Total in Pipeline:</span>
          <span className="px-3 py-1 bg-[#3D2B05] border border-white/30 text-white font-mono font-bold text-xs rounded-lg shadow-sm">
            {orders.length} Requests
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-[#523B08] border border-white/20 p-4 rounded-2xl space-y-4 shadow-md">
        
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'PENDING', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => {
            const count = st === 'ALL' ? orders.length : orders.filter(o => o.status === st).length;
            const isSelected = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  isSelected
                    ? 'bg-white text-[#523D0C] shadow-md'
                    : 'bg-[#3D2B05] text-white/80 hover:text-white hover:bg-[#322303]'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID (PRL-...), customer name, phone, telegram handle, product..."
            className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/50 outline-none pl-9"
          />
          <Search className="w-4 h-4 text-white/60 absolute left-3 top-3" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/90">
            <thead className="bg-[#3D2B05] text-white/80 uppercase tracking-wider text-[11px] border-b border-white/15">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Item & Qty</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status Flow</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#442F05] transition-colors">
                  
                  {/* Order ID */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white">#{order.id}</span>
                    <div className="text-[10px] text-white/60">
                      {new Date(order.createdAt).toLocaleDateString()} &bull; {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Customer Details */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-white/75">{order.customerPhone}</div>
                    {order.customerTelegram && (
                      <div className="text-white font-medium">{order.customerTelegram}</div>
                    )}
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-10 h-10 rounded-lg object-cover border border-white/30 bg-[#352504] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate max-w-xs">{order.productName}</div>
                        <div className="text-[10px] text-white/70">Qty: {order.quantity}</div>
                      </div>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ${order.totalAmount}
                    <div className="text-[10px] text-white/60 font-normal">
                      ~{(order.totalAmount * settings.exchangeRateKhr).toLocaleString()} KHR
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
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
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="p-1.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {order.customerTelegram && (
                        <a
                          href={generateTelegramUrl(order.customerTelegram)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded transition-colors"
                          title="Open Telegram Chat"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete order inquiry #${order.id}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 bg-[#3D2B05] hover:bg-rose-600 text-white rounded transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#523B08] text-white border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/80 font-bold">Order Request Dossier</span>
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Product Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Product summary */}
              <div className="bg-[#3D2B05] p-4 rounded-xl border border-white/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Item Ordered</h4>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                    className="w-16 h-16 rounded-lg object-cover border border-white/30 bg-[#2C1E03] shrink-0"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-white">{selectedOrder.productName}</h5>
                    <div className="text-xs text-white/70 mt-1">Quantity: {selectedOrder.quantity}</div>
                    <div className="text-base font-mono font-bold text-white mt-0.5">${selectedOrder.totalAmount}</div>
                  </div>
                </div>
              </div>

              {/* Customer details */}
              <div className="bg-[#3D2B05] p-4 rounded-xl border border-white/20 space-y-2 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Details</h4>
                <div className="text-white font-bold text-sm">{selectedOrder.customerName}</div>
                <div className="text-white/85 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                {selectedOrder.customerTelegram && (
                  <div className="text-white/85 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-semibold">{selectedOrder.customerTelegram}</span>
                  </div>
                )}
                <div className="text-white/70 pt-1">
                  Preferred Contact: <strong className="text-white uppercase">{selectedOrder.preferredContact}</strong>
                </div>
              </div>

            </div>

            {/* Address & Customer Notes */}
            <div className="space-y-3 text-xs">
              {selectedOrder.customerAddress && (
                <div className="bg-[#3D2B05] p-3 rounded-xl border border-white/20 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Delivery Destination:</strong>
                    <span className="text-white/80">{selectedOrder.customerAddress}</span>
                  </div>
                </div>
              )}

              {selectedOrder.customerNotes && (
                <div className="bg-[#3D2B05] p-3 rounded-xl border border-white/20 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Customer Custom Note / Request:</strong>
                    <span className="text-white/80">{selectedOrder.customerNotes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Internal Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white">
                Admin Concierge Internal Notes (Tracking #, Sizing notes, Ring specs, etc.)
              </label>
              <textarea
                rows={3}
                value={editingAdminNotes}
                onChange={(e) => setEditingAdminNotes(e.target.value)}
                placeholder="e.g. Spoke with customer on Telegram. Requested 45cm chain. Delivery scheduled for Friday 2pm."
                className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg p-3 text-xs text-white outline-none resize-none"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase rounded-lg transition-colors shadow-sm"
              >
                Save Notes
              </button>
            </div>

            {/* Status & Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80 font-medium">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const next = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrder.id, next);
                    setSelectedOrder({ ...selectedOrder, status: next });
                  }}
                  className="bg-[#3D2B05] border border-white/40 text-white font-bold text-xs rounded-lg px-3 py-1.5 outline-none"
                >
                  <option value="PENDING" className="bg-[#3D2B05]">PENDING</option>
                  <option value="CONTACTED" className="bg-[#3D2B05]">CONTACTED</option>
                  <option value="CONFIRMED" className="bg-[#3D2B05]">CONFIRMED</option>
                  <option value="COMPLETED" className="bg-[#3D2B05]">COMPLETED</option>
                  <option value="CANCELLED" className="bg-[#3D2B05]">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {selectedOrder.customerTelegram && (
                  <a
                    href={generateTelegramUrl(selectedOrder.customerTelegram)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open Telegram Chat</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-white/30 text-white text-xs font-bold rounded-lg hover:bg-[#3D2B05]"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
