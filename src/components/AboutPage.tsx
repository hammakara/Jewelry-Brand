import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Award, ShieldCheck, HeartHandshake, MapPin, CheckCircle, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setIsPearlGuideOpen, setCurrentPage, language, settings } = useStore();

  return (
    <div className="min-h-screen bg-[#7B5B12] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Story Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white/90 font-bold bg-[#523B08] px-3 py-1 rounded-full border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{language === 'en' ? 'OUR HERITAGE & VISION' : 'ប្រវត្តិ និងបេសកកម្ម'}</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white">
            {language === 'en' ? 'The Art of Timeless Pearl Mastery' : 'សិល្បៈច្នៃប្រឌិតគុជខ្យងដ៏មានតម្លៃ'}
          </h1>
          <p className="font-serif-luxury text-lg sm:text-xl text-white italic">
            "Pearls are always appropriate." — Jackie Kennedy
          </p>
        </div>

        {/* Brand Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#523B08] p-8 sm:p-12 rounded-2xl border border-white/20 shadow-2xl">
          <div className="space-y-5 text-xs sm:text-sm text-white/85 leading-relaxed">
            <h3 className="font-serif-luxury text-2xl font-bold text-white">
              {language === 'en' ? 'Founded on Authenticity & Elegance' : 'បង្កើតឡើងដោយផ្អែកលើគុណភាព និងភាពថ្លៃថ្នូរ'}
            </h3>
            <p>
              At ប្រណិត (PRANITH), we believe that fine pearl jewelry should be both effortlessly wearable and profoundly timeless. From the crystal-clear coastal waters of Japan and French Polynesia to the pristine pearl farms of Australia, we curate only organic pearls of extraordinary lustre, spherical symmetry, and thick natural nacre.
            </p>
            <p>
              Every necklace, earring pair, and ring is hand-knotted and handset using pure 18K solid gold, 925 sterling silver, and silk threading — ensuring each creation becomes a cherished heirloom for generations to come.
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-3 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-md"
              >
                Explore Boutique Catalog
              </button>
              <button
                onClick={() => setIsPearlGuideOpen(true)}
                className="px-6 py-3 bg-[#3D2B05] border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>Read Pearl Grading Guide</span>
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-white/25 bg-[#382704]">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
              alt="ប្រណិត (PRANITH) Craftsmanship"
              className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#523B08] text-white p-6 rounded-xl border border-white/20 space-y-3 shadow-md">
            <Award className="w-6 h-6 text-white" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">100% Genuine Pearls</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Never synthetic, imitation, or glass pearls. Only authentic cultured freshwater and marine pearls.
            </p>
          </div>

          <div className="bg-[#523B08] text-white p-6 rounded-xl border border-white/20 space-y-3 shadow-md">
            <ShieldCheck className="w-6 h-6 text-white" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">GIA Grading Standards</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Every item comes with our official Certificate of Authenticity and gemological grading card.
            </p>
          </div>

          <div className="bg-[#523B08] text-white p-6 rounded-xl border border-white/20 space-y-3 shadow-md">
            <HeartHandshake className="w-6 h-6 text-white" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">Direct Concierge Service</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Personalized customer assistance via Telegram and phone for sizing, custom requests, and gift packaging.
            </p>
          </div>

          <div className="bg-[#523B08] text-white p-6 rounded-xl border border-white/20 space-y-3 shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
            <h4 className="font-serif-luxury text-lg font-bold text-white">Lifetime Re-stringing</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Complimentary cleaning and re-stringing consultation for all ប្រណិត (PRANITH) strand necklaces.
            </p>
          </div>
        </div>

        {/* Boutique Location Box */}
        <div className="bg-[#523B08] border border-white/20 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-3 shadow-xl">
          <MapPin className="w-6 h-6 text-white mx-auto" />
          <h3 className="font-serif-luxury text-xl font-bold text-white">
            Visit Our Private Showroom
          </h3>
          <p className="text-xs text-white/85">
            {settings.boutiqueAddress}
          </p>
          <div className="text-xs text-white font-bold pt-1">
            {settings.businessHours}
          </div>
        </div>

      </div>
    </div>
  );
};
