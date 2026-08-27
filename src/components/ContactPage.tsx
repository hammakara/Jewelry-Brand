import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast, language } = useStore();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    setIsSent(true);
    showToast('Your message has been sent to our boutique concierge!', 'gold');
    setTimeout(() => {
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
      setIsSent(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'How does the "Contact to Order" system work?',
      qKh: 'តើដំណើរការកុម្ម៉ង់ទិញដំណើរការដូចម្តេច?',
      a: 'When you find a pearl piece you love, click "Contact to Order" and fill in your name, phone, and telegram. Our boutique concierge will immediately reach out to confirm item availability, answer questions, and arrange secured delivery with no upfront payment needed.'
    },
    {
      q: 'Are your pearls 100% authentic and cultured natural pearls?',
      qKh: 'តើគុជខ្យងទាំងអស់ជាគុជធម្មជាតិពិតប្រាកដឬទេ?',
      a: 'Yes, every single piece in our collection is crafted with 100% genuine cultured pearls (Freshwater, Akoya, South Sea, or Tahitian). Each order includes an official Certificate of Authenticity.'
    },
    {
      q: 'Can I request a custom necklace length or ring size?',
      qKh: 'តើខ្ញុំអាចកុម្ម៉ង់ប្រវែងខ្សែក ឬទំហំចិញ្ចៀនតាមចិត្តបានទេ?',
      a: 'Absolutely. Mention your desired ring size or necklace length in the order request notes or chat with us on Telegram. Our jewelers can customize strand lengths and ring mountings.'
    },
    {
      q: 'What is the delivery timeframe and packaging?',
      qKh: 'តើរយៈពេលដឹកជញ្ជូន និងការវេចខ្ចប់យ៉ាងដូចម្តេច?',
      a: 'In Phnom Penh, same-day or next-day VIP hand-delivery is available. Provincial express delivery arrives in 24-48 hours. Every piece arrives in a plush velvet presentation jewelry case with silk ribbon.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#7B5B12] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white/90 font-bold bg-[#523B08] px-3 py-1 rounded-full border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{language === 'en' ? 'BOUTIQUE CONCIERGE' : 'ទំនាក់ទំនងក្រុមការងារ'}</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white">
            {language === 'en' ? 'We Are at Your Service' : 'ទំនាក់ទំនង និងប្រឹក្សាយោបល់'}
          </h1>
          <p className="text-xs sm:text-sm text-white/80">
            {language === 'en'
              ? 'Have questions about pearl grading, bespoke bridal sets, or an existing order request? Our team is available daily.'
              : 'មានចម្ងល់អំពីគុណភាពគុជ ឬការកុម្ម៉ង់ឈុតពិសេស សូមទាក់ទងមកយើងខ្ញុំដោយក្ដីរីករាយ។'}
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info & Direct Telegram (5 cols) */}
          <div className="lg:col-span-5 bg-[#523B08] text-white rounded-2xl p-8 border border-white/20 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Boutique Headquarters
              </h3>

              <div className="space-y-4 text-xs text-white/85">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3D2B05] rounded text-white border border-white/20 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Showroom Address:</strong>
                    <span>{settings.boutiqueAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3D2B05] rounded text-white border border-white/20 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Direct Hotline:</strong>
                    <a href={`tel:${settings.hotline}`} className="text-white font-bold underline hover:text-white/80">
                      {settings.hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3D2B05] rounded text-white border border-white/20 shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Telegram VIP Channel:</strong>
                    <a href={settings.telegramGroupLink} target="_blank" rel="noreferrer" className="text-white font-bold underline hover:text-white/80">
                      @{settings.telegramUsername}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3D2B05] rounded text-white border border-white/20 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Operating Hours:</strong>
                    <span>{settings.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Telegram Box */}
            <div className="bg-[#3D2B05] p-4 rounded-xl border border-white/25 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Send className="w-4 h-4 text-white" />
                <span>Fastest Response via Telegram</span>
              </div>
              <p className="text-[11px] text-white/80">
                Connect directly with our head gemologist on Telegram for instant photos, videos, and price quotations.
              </p>
              <a
                href={settings.telegramGroupLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Open Telegram Chat</span>
              </a>
            </div>

          </div>

          {/* Right: Quick Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#523B08] rounded-2xl p-8 sm:p-10 border border-white/20 shadow-xl">
            <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
              Send a Private Message
            </h3>
            <p className="text-xs text-white/80 mb-6">
              Fill out this form and our team will contact you via Telegram or phone within 2 hours.
            </p>

            {isSent ? (
              <div className="bg-emerald-900/60 border border-emerald-400 text-white p-6 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-300 mx-auto" />
                <h4 className="font-bold text-sm">Thank You for Your Inquiry</h4>
                <p className="text-xs text-emerald-100">
                  Our concierge has received your message and will respond promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Vanna Meas"
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Phone / Telegram *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="012 345 678 or @telegram_username"
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Message / Custom Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="How can we assist you with our pearl collections?"
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/50 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQ Section */}
        <div className="bg-[#523B08] rounded-2xl p-8 sm:p-12 border border-white/20 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-white/80">
              Everything you need to know about purchasing pearl jewelry with Maison des Perles.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="border border-white/20 bg-[#3D2B05] rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-serif-luxury text-base font-bold text-white hover:text-white/90 flex items-center justify-between gap-4 transition-colors"
                  >
                    <span>{language === 'km' ? faq.qKh : faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-white/85 leading-relaxed border-t border-white/15 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
