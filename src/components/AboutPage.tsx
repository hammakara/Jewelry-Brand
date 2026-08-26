import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Award, ShieldCheck, HeartHandshake, MapPin, CheckCircle, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setIsPearlGuideOpen, setCurrentPage, language, settings } = useStore();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Story Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'OUR HERITAGE & VISION' : 'ប្រវត្តិ និងបេសកកម្ម'}</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#F8F5EE]">
            {language === 'en' ? 'The Art of Timeless Pearl Mastery' : 'សិល្បៈច្នៃប្រឌិតគុជខ្យងដ៏មានតម្លៃ'}
          </h1>
          <p className="font-serif-luxury text-lg sm:text-xl text-[#E6C766] italic">
            "Pearls are always appropriate." — Jackie Kennedy
          </p>
        </div>

        {/* Brand Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#141414] p-8 sm:p-12 rounded-2xl border border-[#C9A227]/20 shadow-xl">
          <div className="space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#F8F5EE]">
              {language === 'en' ? 'Founded on Authenticity & Elegance' : 'បង្កើតឡើងដោយផ្អែកលើគុណភាព និងភាពថ្លៃថ្នូរ'}
            </h3>
            <p>
              At Maison des Perles, we believe that fine pearl jewelry should be both effortlessly wearable and profoundly timeless. From the crystal-clear coastal waters of Japan and French Polynesia to the pristine pearl farms of Australia, we curate only organic pearls of extraordinary lustre, spherical symmetry, and thick natural nacre.
            </p>
            <p>
              Every necklace, earring pair, and ring is hand-knotted and handset using pure 18K solid gold, 925 sterling silver, and silk threading — ensuring each creation becomes a cherished heirloom for generations to come.
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-3 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-md"
              >
                Explore Boutique Catalog
              </button>
              <button
                onClick={() => setIsPearlGuideOpen(true)}
                className="px-6 py-3 border border-gray-700 hover:border-[#C9A227] text-gray-200 text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#C9A227]" />
                <span>Read Pearl Grading Guide</span>
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
              alt="Maison des Perles Craftsmanship"
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#141414] text-[#F8F5EE] p-6 rounded-xl border border-[#C9A227]/30 space-y-3 shadow-sm">
            <Award className="w-6 h-6 text-[#C9A227]" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">100% Genuine Pearls</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Never synthetic, imitation, or glass pearls. Only authentic cultured freshwater and marine pearls.
            </p>
          </div>

          <div className="bg-[#141414] text-[#F8F5EE] p-6 rounded-xl border border-[#C9A227]/30 space-y-3 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#C9A227]" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">GIA Grading Standards</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every item comes with our official Certificate of Authenticity and gemological grading card.
            </p>
          </div>

          <div className="bg-[#141414] text-[#F8F5EE] p-6 rounded-xl border border-[#C9A227]/30 space-y-3 shadow-sm">
            <HeartHandshake className="w-6 h-6 text-[#C9A227]" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">Direct Concierge Service</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Personalized customer assistance via Telegram and phone for sizing, custom requests, and gift packaging.
            </p>
          </div>

          <div className="bg-[#141414] text-[#F8F5EE] p-6 rounded-xl border border-[#C9A227]/30 space-y-3 shadow-sm">
            <Sparkles className="w-6 h-6 text-[#C9A227]" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">Lifetime Re-stringing</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complimentary cleaning and re-stringing consultation for all Maison des Perles strand necklaces.
            </p>
          </div>
        </div>

        {/* Boutique Location Box */}
        <div className="bg-[#141414] border border-[#C9A227]/30 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-3 shadow-xl">
          <MapPin className="w-6 h-6 text-[#C9A227] mx-auto" />
          <h3 className="font-serif-luxury text-xl font-bold text-[#F8F5EE]">
            Visit Our Private Showroom
          </h3>
          <p className="text-xs text-gray-300">
            {settings.boutiqueAddress}
          </p>
          <div className="text-xs text-[#E6C766] font-semibold pt-1">
            {settings.businessHours}
          </div>
        </div>

      </div>
    </div>
  );
};
