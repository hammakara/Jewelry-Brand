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
      <div className="relative w-full max-w-2xl bg-[#523B08] text-white border border-white/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Ribbon */}
        <div className="bg-[#442F05] border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <h3 className="font-display-luxury text-base sm:text-lg font-bold tracking-wider text-white">
              {submittedOrder 
                ? (language === 'en' ? 'ORDER REQUEST CONFIRMED' : 'ការស្នើសុំកុម្ម៉ង់បានជោគជ័យ')
                : (language === 'en' ? 'CONTACT TO ORDER' : 'ស្នើសុំកុម្ម៉ង់ទិញផលិតផល')}
            </h3>
          </div>
          <button
            onClick={closeOrderModal}
            className="text-white/70 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        {!submittedOrder ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Attached Product Summary Card */}
            <div className="bg-[#3D2B05] border border-white/25 rounded-xl p-4 flex gap-4 items-center shadow-inner">
              <img
                src={orderModalProduct.images[0]}
                alt={orderModalProduct.name}
                className="w-20 h-20 object-cover rounded-lg border border-white/30 shrink-0 bg-[#2C1D02]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-white/20 px-2 py-0.5 rounded border border-white/30">
                    {orderModalProduct.pearlType} Pearl
                  </span>
                  <span className="text-xs text-white/75">SKU: {orderModalProduct.sku}</span>
                </div>

                <h4 className="font-serif-luxury text-lg font-bold text-white truncate mt-1">
                  {language === 'km' && orderModalProduct.nameKhmer ? orderModalProduct.nameKhmer : orderModalProduct.name}
                </h4>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm font-bold text-white">
                    ${orderModalProduct.price} <span className="text-xs text-white/70 font-normal">/ piece</span>
                  </div>
                  <div className="text-xs text-white/75">
                    {orderModalProduct.size} &bull; {orderModalProduct.material}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Calculation */}
            <div className="flex items-center justify-between bg-[#442F05] p-3.5 rounded-xl border border-white/20">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'en' ? 'Quantity' : 'ចំនួន'}:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/30 rounded-lg bg-[#342404]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-white hover:bg-white/20 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-white min-w-[2rem] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-white hover:bg-white/20 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-right pl-3 border-l border-white/20">
                  <div className="text-base font-bold text-white">${subtotal}</div>
                  <div className="text-[10px] text-white/75">~{subtotalKhr.toLocaleString()} KHR</div>
                </div>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>{language === 'en' ? 'Customer Contact Information' : 'ព័ត៌មានអតិថិជន'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/90 mb-1">
                    {language === 'en' ? 'Full Name *' : 'ឈ្មោះពេញ *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Sokha Chan' : 'ឧ. ចាន់ សុខា'}
                    className="w-full bg-[#342404] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/50 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/90 mb-1">
                    {language === 'en' ? 'Phone Number *' : 'លេខទូរស័ព្ទ *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full bg-[#342404] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/50 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/90 mb-1">
                    {language === 'en' ? 'Telegram Username / Phone' : 'Telegram (Username ឬ លេខ)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerTelegram}
                      onChange={(e) => setCustomerTelegram(e.target.value)}
                      placeholder="@username or phone"
                      className="w-full bg-[#342404] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/50 outline-none transition-colors pl-9"
                    />
                    <Send className="w-4 h-4 text-white/60 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/90 mb-1">
                    {language === 'en' ? 'City / Province' : 'រាជធានី / ខេត្ត'}
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-[#342404] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                  >
                    <option value="Phnom Penh" className="bg-[#342404] text-white">Phnom Penh (រាជធានីភ្នំពេញ)</option>
                    <option value="Kandal" className="bg-[#342404] text-white">Kandal (កណ្តាល)</option>
                    <option value="Siem Reap" className="bg-[#342404] text-white">Siem Reap (សៀមរាប)</option>
                    <option value="Sihanoukville" className="bg-[#342404] text-white">Sihanoukville (ព្រះសីហនុ)</option>
                    <option value="Battambang" className="bg-[#342404] text-white">Battambang (បាត់ដំបង)</option>
                    <option value="Kampot" className="bg-[#342404] text-white">Kampot (កំពត)</option>
                    <option value="Takeo" className="bg-[#342404] text-white">Takeo (តាកែវ)</option>
                    <option value="Kampong Cham" className="bg-[#342404] text-white">Kampong Cham (កំពង់ចាម)</option>
                    <option value="Other Province" className="bg-[#342404] text-white">Other Province / International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">
                  {language === 'en' ? 'Delivery Address (Street / House / Borey)' : 'អាសយដ្ឋានដឹកជញ្ជូន'}
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. St 214, BKK1, Phnom Penh' : 'ឧ. ផ្ទះលេខ..., ផ្លូវ..., សង្កាត់...'}
                  className="w-full bg-[#342404] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/50 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/90 mb-1">
                  {language === 'en' ? 'Special Instructions / Notes (Optional)' : 'ចំណាំបន្ថែម (ស្រេចចិត្ត)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Ring size 6.5, ribbon gift box request, urgent wedding delivery...' : 'ឧ. ទំហំចិញ្ចៀន, កញ្ចប់កាដូពិសេស...'}
                  className="w-full bg-[#342404] border border-white/30 focus:border-white focus:ring-1 focus:ring-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/50 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Reassurance Disclaimer */}
            <div className="bg-[#442F05] p-3.5 rounded-xl text-[11px] text-white/80 flex items-start gap-2 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
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
                className="w-1/3 py-3 border border-white/30 hover:border-white text-white text-xs uppercase tracking-widest font-bold rounded-lg transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs uppercase tracking-widest font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#523D0C] border-t-transparent"></span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#523D0C]" />
                    <span>{language === 'en' ? 'SEND ORDER REQUEST' : 'ផ្ញើសំណើកុម្ម៉ង់ទិញ'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto text-[#523D0C]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-white/90 font-bold bg-[#442F05] px-3 py-1 rounded-full border border-white/20 inline-block">
                {language === 'en' ? 'Request Received by Maison des Perles' : 'ទទួលបានសំណើកុម្ម៉ង់ជោគជ័យ'}
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-3">
                {language === 'en' ? 'Thank You for Your Order Request' : 'សូមអរគុណសម្រាប់ការកុម្ម៉ង់'}
              </h3>
              <p className="text-xs text-white/80 mt-2 max-w-md mx-auto">
                {language === 'en'
                  ? 'Your request has been registered in our boutique system. Our concierge will contact you shortly to confirm and arrange luxury delivery.'
                  : 'សំណើរបស់អ្នកត្រូវបានបញ្ជូនទៅកាន់ប្រព័ន្ធគ្រប់គ្រងហាង។ យើងខ្ញុំនឹងទាក់ទងលោកអ្នកតាមរយៈ Telegram ឬទូរស័ព្ទក្នុងពេលឆាប់ៗនេះ។'}
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#3D2B05] border border-white/30 rounded-xl p-4 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/75">Order ID:</span>
                  <span className="text-base font-bold text-white tracking-wider font-mono">
                    #{submittedOrder.id}
                  </span>
                </div>
                <button
                  onClick={() => copyOrderId(submittedOrder.id)}
                  className="flex items-center gap-1 text-xs text-white font-bold hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedOrderId ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
                <div><span className="text-white/60">Product:</span> {submittedOrder.productName}</div>
                <div><span className="text-white/60">Quantity:</span> {submittedOrder.quantity} item(s)</div>
                <div><span className="text-white/60">Total:</span> <strong className="text-white">${submittedOrder.totalAmount}</strong></div>
                <div><span className="text-white/60">Status:</span> <span className="text-white font-bold">{submittedOrder.status}</span></div>
                <div><span className="text-white/60">Name:</span> {submittedOrder.customerName}</div>
                <div><span className="text-white/60">Phone:</span> {submittedOrder.customerPhone}</div>
              </div>
            </div>

            {/* Direct Telegram Action */}
            <div className="space-y-3 pt-2">
              <a
                href={generateTelegramLink(submittedOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#523D0C] font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4 text-[#523D0C]" />
                <span>{language === 'en' ? 'OPEN TELEGRAM TO CHAT WITH BOUTIQUE' : 'បើក TELEGRAM ដើម្បីបញ្ជាក់ជាមួយហាង'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#523D0C]" />
              </a>

              <div className="flex gap-3">
                <a
                  href={`tel:${settings.hotline}`}
                  className="flex-1 py-2.5 bg-[#442F05] border border-white/30 hover:border-white text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>Call Boutique</span>
                </a>

                <button
                  onClick={() => {
                    closeOrderModal();
                    setCurrentPage('order-tracker');
                  }}
                  className="flex-1 py-2.5 bg-[#442F05] border border-white/30 hover:border-white text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Track Order</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            <button
              onClick={closeOrderModal}
              className="text-xs text-white/80 hover:text-white underline pt-2 block mx-auto font-medium"
            >
              {language === 'en' ? 'Close and continue browsing' : 'បិទផ្ទាំងនេះ ហើយបន្តទស្សនា'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
