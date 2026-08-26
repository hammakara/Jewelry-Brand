import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Award, ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const { setIsPearlGuideOpen, language } = useStore();

  return (
    <section className="py-20 bg-[#141414] text-[#F8F5EE] border-b border-[#C9A227]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'OUR CRAFTSMANSHIP' : 'សិល្បៈច្នៃប្រឌិតគុជខ្យង'}</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {language === 'en'
                ? 'Born in the Depths, Perfected by Master Jewelers'
                : 'កកើតឡើងពីជម្រៅបាតសមុទ្រ ច្នៃដោយវិចិត្រករជំនាញ'}
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              {language === 'en'
                ? 'Unlike gemstones cut and polished by machines, every organic pearl is a miracle of nature created inside living oysters over years of patient nurturing. At Maison des Perles, only top 1% of harvested pearls meet our exacting standards for mirror-grade lustre, thick iridescent nacre, and pristine surface cleanliness.'
                : 'មិនដូចត្បូងដទៃដែលត្រូវកាត់ឆ្នៃដោយម៉ាស៊ីននោះទេ គុជខ្យងធម្មជាតិកើតឡើងពីដំណើរការធម្មជាតិក្នុងរយៈពេលជាច្រើនឆ្នាំ។ យើងខ្ញុំសម្រិតសម្រាំងយកតែគុជខ្យងកម្រិតកំពូល ១% ប៉ុណ្ណោះដែលមានពន្លឺរលោងចែងចាំង និងស្បែករលោងឥតខ្ចោះ។'}
            </p>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#1C1C1C] p-4 rounded border border-[#C9A227]/20">
                <Award className="w-5 h-5 text-[#C9A227] mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === 'en' ? 'Natural Lustre & Iridescence' : 'ពន្លឺចែងចាំងធម្មជាតិ'}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">
                  High refraction index giving pearls their signature radiant glow.
                </p>
              </div>

              <div className="bg-[#1C1C1C] p-4 rounded border border-[#C9A227]/20">
                <ShieldCheck className="w-5 h-5 text-[#C9A227] mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === 'en' ? 'Solid 18K Gold & 925 Silver' : 'មាសសុទ្ធ 18K & ប្រាក់ ៩២៥'}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">
                  Hypoallergenic precious metals ensuring lifelong wear and value.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPearlGuideOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-widest rounded transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>{language === 'en' ? 'Learn Pearl Grading & Varieties' : 'ស្វែងយល់បន្ថែមអំពីកម្រិតគុជ'}</span>
              </button>
            </div>
          </div>

          {/* Right Image Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#C9A227]/40 shadow-2xl bg-black">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
                alt="Pearl Master Jeweler Craft"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Luxury Tag */}
            <div className="absolute -bottom-6 -left-6 bg-[#0B0B0B] border border-[#C9A227]/60 p-5 rounded-lg shadow-2xl hidden sm:flex items-center gap-4 max-w-xs">
              <span className="w-10 h-10 rounded-full pearl-shimmer border border-[#C9A227] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#C9A227]" />
              </span>
              <div>
                <div className="text-xs font-bold text-[#E6C766]">GIA Standards Applied</div>
                <div className="text-[10px] text-gray-400">Every piece inspected by qualified gemologists</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
