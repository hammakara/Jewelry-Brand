import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Award, Eye, BookOpen } from 'lucide-react';

export const HomeHero: React.FC = () => {
  const { setCurrentPage, setIsPearlGuideOpen, language } = useStore();

  return (
    <section className="relative bg-[#0B0B0B] text-[#F8F5EE] overflow-hidden border-b border-[#C9A227]/25">
      {/* Subtle Background Radial Pearl Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A227]/30 via-transparent to-transparent"></div>
      
      {/* Decorative framing lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full border-x border-[#C9A227]/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Top Luxury Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#C9A227]/40 text-[#E6C766] text-xs font-semibold tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse"></span>
            <span>
              {language === 'en' ? 'Haute Joaillerie &bull; 100% Cultured Natural Pearls' : 'គ្រឿងអលង្ការគុជខ្យងធម្មជាតិ ១០០%'}
            </span>
          </div>

          {/* Main Headline exact from User Prompt */}
          <div className="space-y-3">
            <h1 className="font-display-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.18em] text-[#F8F5EE] uppercase leading-tight sm:leading-none">
              ELEGANCE IN EVERY PEARL
            </h1>
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#E6C766]/90 italic font-light max-w-xl mx-auto">
              {language === 'en'
                ? 'Discover timeless pearl jewelry handcrafted for life’s most cherished moments.'
                : 'ស្វែងរកគ្រឿងអលង្ការគុជខ្យងដ៏វិសេសវិសាល និងមិនចេះសាបសូន្យ'}
            </p>
          </div>

          {/* Luxury Description */}
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            {language === 'en'
              ? 'Hand-selected Japanese Akoya, Australian South Sea, and Tahitian Black pearls set in 18K solid gold and 925 sterling silver.'
              : 'សម្រិតសម្រាំងពីគុជខ្យង Akoya ជប៉ុន, South Sea អូស្ត្រាលី និង Tahitian ខ្មៅ ស្រោបដោយមាស 18K និងប្រាក់សុទ្ធ ៩២៥។'}
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCurrentPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] font-display-luxury text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_6px_25px_rgba(201,162,39,0.6)] transition-all flex items-center justify-center gap-3 group"
            >
              <span>{language === 'en' ? 'SHOP COLLECTION' : 'មើលទំនិញទាំងអស់'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsPearlGuideOpen(true)}
              className="w-full sm:w-auto px-6 py-4 border border-[#C9A227]/50 hover:border-[#C9A227] text-[#F8F5EE] hover:text-[#E6C766] hover:bg-[#161616] font-display-luxury text-xs sm:text-sm font-semibold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#C9A227]" />
              <span>{language === 'en' ? 'PEARL GUIDE' : 'មគ្គុទ្ទេសក៍គុជ'}</span>
            </button>
          </div>

          {/* Quality Proof Points */}
          <div className="pt-8 sm:pt-12 grid grid-cols-3 gap-2 sm:gap-6 border-t border-gray-800/80 max-w-2xl mx-auto text-center">
            <div className="space-y-1">
              <div className="font-display-luxury text-lg sm:text-2xl font-bold text-[#E6C766]">AAAA</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Top Lustre Grade</div>
            </div>
            <div className="space-y-1 border-x border-gray-800">
              <div className="font-display-luxury text-lg sm:text-2xl font-bold text-[#E6C766]">18K / 925</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Solid Metals</div>
            </div>
            <div className="space-y-1">
              <div className="font-display-luxury text-lg sm:text-2xl font-bold text-[#E6C766]">1-ON-1</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Concierge Care</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
