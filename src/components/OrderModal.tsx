import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Sparkles, 
  Send, 
  Phone, 
  CheckCircle, 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  ExternalLink,
  Copy,
  ChevronRight
} from 'lucide-react';
import { OrderRequest } from '../types';

export const OrderModal: React.FC = () => {
  const { 
    isOrderModalOpen, 
    closeOrderModal, 
    orderModalProduct, 
    createOrderRequest, 
    settings, 
    language,
    setCurrentPage 
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Phnom Penh');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRequest | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Reset modal state when product changes or opens
  useEffect(() => {
    if (isOrderModalOpen) {
      setQuantity(1);
      setSubmittedOrder(null);
      setIsSubmitting(false);
      setCopiedOrderId(false);
    }
  }, [isOrderModalOpen, orderModalProduct]);

  if (!isOrderModalOpen || !orderModalProduct) return null;

  const subtotal = orderModalProduct.price * quantity;
  const subtotalKhr = subtotal * settings.exchangeRateKhr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrderRequest({
        productId: orderModalProduct.id,
        productName: orderModalProduct.name,
        productPrice: orderModalProduct.price,
        productImage: orderModalProduct.images[0] || '',
        pearlType: orderModalProduct.pearlType,
        size: orderModalProduct.size,
        material: orderModalProduct.material,
        quantity,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerTelegram: customerTelegram.trim() || customerPhone.trim(),
        customerAddress: customerAddress.trim() || 'Direct Store Pickup / To confirm',
        customerCity,
        notes: notes.trim(),
      });

      setSubmittedOrder(newOrder);
      setIsSubmitting(false);
    }, 400);
  };

  const generateTelegramLink = (order: OrderRequest) => {
    const text = encodeURIComponent(
      `💎 *ORDER REQUEST #${order.id}*\n` +
      `--------------------------------\n` +
      `🛍️ *Item:* ${order.productName}\n` +
      `🏷️ *Price:* $${order.productPrice} x ${order.quantity} = $${order.totalAmount}\n` +
      `✨ *Pearl Type:* ${order.pearlType} (${order.size || 'Standard'})\n` +
      `👤 *Customer:* ${order.customerName}\n` +
      `📞 *Phone:* ${order.customerPhone}\n` +
      `✈️ *Telegram:* ${order.customerTelegram}\n` +
      `📍 *Location:* ${order.customerAddress}, ${order.customerCity}\n` +
      (order.notes ? `📝 *Note:* ${order.notes}\n` : '') +
      `\nHello Maison des Perles Boutique! I would like to confirm my order request.`
    );
    return `https://t.me/${settings.telegramUsername}?text=${text}`;
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0B0B] text-[#F8F5EE] border border-[#C9A227]/40 rounded-xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Ribbon */}
        <div className="bg-[#141414] border-b border-[#C9A227]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227] animate-pulse"></span>
            <h3 className="font-display-luxury text-base sm:text-lg font-bold tracking-wider text-[#F8F5EE]">
              {submittedOrder 
                ? (language === 'en' ? 'ORDER REQUEST CONFIRMED' : 'ការស្នើសុំកុម្ម៉ង់បានជោគជ័យ')
                : (language === 'en' ? 'CONTACT TO ORDER' : 'ស្នើសុំកុម្ម៉ង់ទិញផលិតផល')}
            </h3>
          </div>
          <button
            onClick={closeOrderModal}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!submittedOrder ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Attached Product Summary Card */}
            <div className="bg-[#161616] border border-[#C9A227]/30 rounded-lg p-4 flex gap-4 items-center">
              <img
                src={orderModalProduct.images[0]}
                alt={orderModalProduct.name}
                className="w-20 h-20 object-cover rounded border border-[#C9A227]/20 shrink-0 bg-white"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/30">
                    {orderModalProduct.pearlType} Pearl
                  </span>
                  <span className="text-xs text-gray-400">SKU: {orderModalProduct.sku}</span>
                </div>

                <h4 className="font-serif-luxury text-lg font-bold text-white truncate mt-1">
                  {language === 'km' && orderModalProduct.nameKhmer ? orderModalProduct.nameKhmer : orderModalProduct.name}
                </h4>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm font-semibold text-[#E6C766]">
                    ${orderModalProduct.price} <span className="text-xs text-gray-400 font-normal">/ piece</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {orderModalProduct.size} &bull; {orderModalProduct.material}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Calculation */}
            <div className="flex items-center justify-between bg-[#121212] p-3.5 rounded border border-gray-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                {language === 'en' ? 'Quantity' : 'ចំនួន'}:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#C9A227]/40 rounded bg-[#1C1C1C]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-300 hover:text-white hover:bg-[#C9A227]/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-semibold text-white min-w-[2rem] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-300 hover:text-white hover:bg-[#C9A227]/20 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-right pl-3 border-l border-gray-800">
                  <div className="text-base font-bold text-[#E6C766]">${subtotal}</div>
                  <div className="text-[10px] text-gray-400">~{subtotalKhr.toLocaleString()} KHR</div>
                </div>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Customer Contact Information' : 'ព័ត៌មានអតិថិជន'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Full Name *' : 'ឈ្មោះពេញ *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Sokha Chan' : 'ឧ. ចាន់ សុខា'}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Phone Number *' : 'លេខទូរស័ព្ទ *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Telegram Username / Phone' : 'Telegram (Username ឬ លេខ)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerTelegram}
                      onChange={(e) => setCustomerTelegram(e.target.value)}
                      placeholder="@username or phone"
                      className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors pl-9"
                    />
                    <Send className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'City / Province' : 'រាជធានី / ខេត្ត'}
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                  >
                    <option value="Phnom Penh">Phnom Penh (រាជធានីភ្នំពេញ)</option>
                    <option value="Kandal">Kandal (កណ្តាល)</option>
                    <option value="Siem Reap">Siem Reap (សៀមរាប)</option>
                    <option value="Sihanoukville">Sihanoukville (ព្រះសីហនុ)</option>
                    <option value="Battambang">Battambang (បាត់ដំបង)</option>
                    <option value="Kampot">Kampot (កំពត)</option>
                    <option value="Takeo">Takeo (តាកែវ)</option>
                    <option value="Kampong Cham">Kampong Cham (កំពង់ចាម)</option>
                    <option value="Other Province">Other Province / International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Delivery Address (Street / House / Borey)' : 'អាសយដ្ឋានដឹកជញ្ជូន'}
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. St 214, BKK1, Phnom Penh' : 'ឧ. ផ្ទះលេខ..., ផ្លូវ..., សង្កាត់...'}
                  className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Special Instructions / Notes (Optional)' : 'ចំណាំបន្ថែម (ស្រេចចិត្ត)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Ring size 6.5, ribbon gift box request, urgent wedding delivery...' : 'ឧ. ទំហំចិញ្ចៀន, កញ្ចប់កាដូពិសេស...'}
                  className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Reassurance Disclaimer */}
            <div className="bg-[#121212] p-3 rounded text-[11px] text-gray-400 flex items-start gap-2 border border-gray-800">
              <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
              <span>
                {language === 'en'
                  ? 'No advance payment required now. Our concierge will review your request and connect with you directly on Telegram or Phone to confirm availability and express delivery.'
                  : 'មិនទាន់តម្រូវឱ្យបង់ប្រាក់ជាមុនឡើយ។ ក្រុមការងារនឹងទាក់ទងបញ្ជាក់ព័ត៌មាន និងដឹកជញ្ជូនជូនលោកអ្នកផ្ទាល់។'}
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeOrderModal}
                className="w-1/3 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs uppercase tracking-widest font-bold rounded shadow-[0_4px_14px_rgba(201,162,39,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{language === 'en' ? 'SEND ORDER REQUEST' : 'ផ្ញើសំណើកុម្ម៉ង់ទិញ'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#C9A227]/20 border border-[#C9A227] flex items-center justify-center mx-auto text-[#C9A227]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
                {language === 'en' ? 'Request Received by Maison des Perles' : 'ទទួលបានសំណើកុម្ម៉ង់ជោគជ័យ'}
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
                {language === 'en' ? 'Thank You for Your Order Request' : 'សូមអរគុណសម្រាប់ការកុម្ម៉ង់'}
              </h3>
              <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
                {language === 'en'
                  ? 'Your request has been registered in our boutique system. Our concierge will contact you shortly to confirm and arrange luxury delivery.'
                  : 'សំណើរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់ប្រព័ន្ធគ្រប់គ្រងហាង។ យើងខ្ញុំនឹងទាក់ទងលោកអ្នកតាមរយៈ Telegram ឬទូរស័ព្ទក្នុងពេលឆាប់ៗនេះ។'}
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#141414] border border-[#C9A227]/40 rounded-lg p-4 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Order ID:</span>
                  <span className="text-base font-bold text-[#E6C766] tracking-wider font-mono">
                    #{submittedOrder.id}
                  </span>
                </div>
                <button
                  onClick={() => copyOrderId(submittedOrder.id)}
                  className="flex items-center gap-1 text-xs text-[#C9A227] hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedOrderId ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div><span className="text-gray-500">Product:</span> {submittedOrder.productName}</div>
                <div><span className="text-gray-500">Quantity:</span> {submittedOrder.quantity} item(s)</div>
                <div><span className="text-gray-500">Total:</span> <strong className="text-[#E6C766]">${submittedOrder.totalAmount}</strong></div>
                <div><span className="text-gray-500">Status:</span> <span className="text-amber-400 font-semibold">{submittedOrder.status}</span></div>
                <div><span className="text-gray-500">Name:</span> {submittedOrder.customerName}</div>
                <div><span className="text-gray-500">Phone:</span> {submittedOrder.customerPhone}</div>
              </div>
            </div>

            {/* Direct Telegram Action */}
            <div className="space-y-3 pt-2">
              <a
                href={generateTelegramLink(submittedOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest rounded shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'en' ? 'OPEN TELEGRAM TO CHAT WITH BOUTIQUE' : 'បើក TELEGRAM ដើម្បីបញ្ជាក់ជាមួយហាង'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex gap-3">
                <a
                  href={`tel:${settings.hotline}`}
                  className="flex-1 py-2.5 border border-gray-700 hover:border-[#C9A227] text-gray-300 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Call Boutique</span>
                </a>

                <button
                  onClick={() => {
                    closeOrderModal();
                    setCurrentPage('order-tracker');
                  }}
                  className="flex-1 py-2.5 border border-gray-700 hover:border-[#C9A227] text-gray-300 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Track Order</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </button>
              </div>
            </div>

            <button
              onClick={closeOrderModal}
              className="text-xs text-gray-400 hover:text-white underline pt-2 block mx-auto"
            >
              {language === 'en' ? 'Close and continue browsing' : 'បិទផ្ទាំងនេះ ហើយបន្តទស្សនា'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
