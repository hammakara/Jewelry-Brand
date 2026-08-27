import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, ShieldCheck, Award, Eye, BookOpen } from 'lucide-react';

export const HomeHero: React.FC = () => {
  const { setCurrentPage, setIsPearlGuideOpen, language } = useStore();

  return (
    <section className="relative bg-gradient-to-b from-[#876516] via-[#73530F] to-[#5C420A] text-white overflow-hidden border-b border-white/20">
      {/* Subtle Background Radial Pearl Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
      
      {/* Decorative framing lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full border-x border-white/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Top Luxury Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4E3707] border border-white/35 text-white text-xs font-semibold tracking-widest uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>
              {language === 'en' ? 'Haute Joaillerie &bull; 100% Cultured Natural Pearls' : 'គ្រឿងអលង្ការគុជខ្យងធម្មជាតិ ១០០%'}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="font-display-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.18em] text-white uppercase leading-tight sm:leading-none drop-shadow-sm">
              ELEGANCE IN EVERY PEARL
            </h1>
            <p className="font-serif-luxury text-xl sm:text-2xl text-white/95 italic font-light max-w-xl mx-auto">
              {language === 'en'
                ? 'Discover timeless pearl jewelry handcrafted for life’s most cherished moments.'
                : 'ស្វែងរកគ្រឿងអលង្ការគុជខ្យងដ៏វិសេសវិសាល និងមិនចេះសាបសូន្យ'}
            </p>
          </div>

          {/* Luxury Description */}
          <p className="text-xs sm:text-sm text-white/85 max-w-lg mx-auto leading-relaxed font-normal">
            {language === 'en'
              ? 'Hand-selected Japanese Akoya, Australian South Sea, and Tahitian Black pearls set in 18K solid gold and 925 sterling silver.'
              : 'សម្រិតសម្រាំងពីគុជខ្យង Akoya ជប៉ុន, South Sea អូស្ត្រាលី និង Tahitian ខ្មៅ ស្រោបដោយមាស 18K និងប្រាក់សុទ្ធ ៩២៥។'}
          </p>

          {/* Primary CTA Buttons (White as Primary) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCurrentPage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-100 text-[#543D0B] font-display-luxury text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded shadow-[0_4px_25px_rgba(255,255,255,0.45)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.65)] transition-all flex items-center justify-center gap-3 group"
            >
              <span>{language === 'en' ? 'SHOP COLLECTION' : 'មើលទំនិញទាំងអស់'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#543D0B]" />
            </button>

            <button
              onClick={() => setIsPearlGuideOpen(true)}
              className="w-full sm:w-auto px-6 py-4 border-2 border-white/70 hover:border-white text-white hover:bg-white/15 font-display-luxury text-xs sm:text-sm font-semibold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>{language === 'en' ? 'PEARL GUIDE' : 'មគ្គុទ្ទេសក៍គុជ'}</span>
            </button>
          </div>

          {/* Quality Proof Points */}
          <div className="pt-8 sm:pt-12 grid grid-cols-3 gap-2 sm:gap-6 border-t border-white/20 max-w-2xl mx-auto text-center">
            <div className="space-y-1">
              <div className="font-display-luxury text-lg sm:text-2xl font-bold text-white">AAAA</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider font-medium">Top Lustre Grade</div>
            </div>
            <div className="space-y-1 border-x border-white/20">
              <div className="font-display-luxury text-lg sm:text-2xl font-bold text-white">18K / 925</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider font-medium">Solid Metals</div>
            </div>
            <div className="space-y-1">
              <div className="font-display-luxury text-lg sm:text-2xl font-bold text-white">1-ON-1</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider font-medium">Concierge Care</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
