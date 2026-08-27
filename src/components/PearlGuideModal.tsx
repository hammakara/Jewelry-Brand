import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, Award, Shield, Check, Info } from 'lucide-react';

export const PearlGuideModal: React.FC = () => {
  const { isPearlGuideOpen, setIsPearlGuideOpen, language } = useStore();

  if (!isPearlGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#523B08] text-white border border-white/30 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#442F05] border-b border-white/20 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="font-display-luxury text-base sm:text-lg font-bold tracking-wider text-white">
              {language === 'en' ? 'THE MAISON PEARL CONNOISSEUR GUIDE' : 'មគ្គុទ្ទេសក៍ចំណេះដឹងអំពីគុជខ្យងប្រណីត'}
            </h3>
          </div>
          <button
            onClick={() => setIsPearlGuideOpen(false)}
            className="text-white/70 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          {/* Pearl Varieties Grid */}
          <div>
            <h4 className="font-display-luxury text-sm font-bold uppercase tracking-widest text-white mb-4 bg-[#3D2B05] px-3 py-1.5 rounded-lg border border-white/20 inline-block">
              1. Four Major Pearl Varieties (ប្រភេទគុជខ្យងទាំង ៤)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-[#3D2B05] border border-white/25 p-4 rounded-xl shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif-luxury text-lg font-bold text-white">Freshwater Pearls (គុជទឹកសាប)</span>
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded border border-white/30">Versatile & Durable</span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">
                  Cultivated in fresh lakes and rivers. Composed of 100% solid natural nacre, making them remarkably durable for daily wear. Range in pastel tones from cream to soft lavender pink.
                </p>
                <div className="mt-3 text-[11px] text-white/90 font-bold flex items-center gap-4 border-t border-white/15 pt-2">
                  <span>Size: 6mm - 11mm</span>
                  <span>Origin: East Asia Lakes</span>
                </div>
              </div>

              <div className="bg-[#3D2B05] border border-white/25 p-4 rounded-xl shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif-luxury text-lg font-bold text-white">Japanese Akoya (គុជជប៉ុន Akoya)</span>
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded border border-white/30">Mirror-Like Lustre</span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">
                  Renowned worldwide for razor-sharp, mirror-like reflective lustre and perfectly spherical shapes. The gold standard for royal bridal necklaces and classic solitaire studs.
                </p>
                <div className="mt-3 text-[11px] text-white/90 font-bold flex items-center gap-4 border-t border-white/15 pt-2">
                  <span>Size: 7mm - 9.5mm</span>
                  <span>Origin: Japan Ocean Bays</span>
                </div>
              </div>

              <div className="bg-[#3D2B05] border border-white/25 p-4 rounded-xl shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif-luxury text-lg font-bold text-white">Tahitian Black Pearls (គុជខ្មៅតាហ៊ីទី)</span>
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded border border-white/30">Exotic Overtones</span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">
                  Naturally dark saltwater pearls born from the black-lipped Pinctada margaritifera oyster in French Polynesia. Famous for vibrant peacock green, eggplant, and graphite overtones.
                </p>
                <div className="mt-3 text-[11px] text-white/90 font-bold flex items-center gap-4 border-t border-white/15 pt-2">
                  <span>Size: 8.5mm - 14mm</span>
                  <span>Origin: French Polynesia</span>
                </div>
              </div>

              <div className="bg-[#3D2B05] border border-white/25 p-4 rounded-xl shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif-luxury text-lg font-bold text-white">South Sea Golden & White (គុជសមុទ្រខាងត្បូង)</span>
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded border border-white/30">Queen of Pearls</span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">
                  The largest, rarest, and most valuable cultured pearls on earth. Produced by the giant Pinctada maxima oyster with thick, satin velvet nacre and natural golden champagne hues.
                </p>
                <div className="mt-3 text-[11px] text-white/90 font-bold flex items-center gap-4 border-t border-white/15 pt-2">
                  <span>Size: 9mm - 18mm+</span>
                  <span>Origin: Australia & Philippines</span>
                </div>
              </div>

            </div>
          </div>

          {/* Size Comparison Chart */}
          <div className="bg-[#3D2B05] border border-white/25 p-5 rounded-xl">
            <h4 className="font-display-luxury text-sm font-bold uppercase tracking-widest text-white mb-3">
              2. Millimeter Size Visualizer (ខ្នាតទំហំមីលីម៉ែត្រ)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-[#342404] p-3 rounded-lg border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white mx-auto mb-2 border-2 border-white/50 shadow"></div>
                <div className="text-xs font-bold text-white">6.0 - 7.5 mm</div>
                <div className="text-[10px] text-white/70 mt-0.5">Petite & Everyday Studs</div>
              </div>
              <div className="bg-[#342404] p-3 rounded-lg border border-white/20">
                <div className="w-10 h-10 rounded-full bg-white mx-auto mb-2 border-2 border-white/50 shadow"></div>
                <div className="text-xs font-bold text-white">8.0 - 9.0 mm</div>
                <div className="text-[10px] text-white/70 mt-0.5">Classic Princess Strands</div>
              </div>
              <div className="bg-[#342404] p-3 rounded-lg border border-white/20">
                <div className="w-12 h-12 rounded-full bg-white mx-auto mb-2 border-2 border-white/50 shadow"></div>
                <div className="text-xs font-bold text-white">10.0 - 11.5 mm</div>
                <div className="text-[10px] text-white/70 mt-0.5">Statement Solitaires & Pendants</div>
              </div>
              <div className="bg-[#342404] p-3 rounded-lg border border-white/20">
                <div className="w-14 h-14 rounded-full bg-neutral-100 mx-auto mb-2 border-2 border-white/50 shadow"></div>
                <div className="text-xs font-bold text-white">12.0 - 15.0 mm+</div>
                <div className="text-[10px] text-white/70 mt-0.5">Grand South Sea & Tahitian</div>
              </div>
            </div>
          </div>

          {/* Care Guidelines */}
          <div>
            <h4 className="font-display-luxury text-sm font-bold uppercase tracking-widest text-white mb-3">
              3. "Last on, First Off" Pearl Care Ritual
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/85">
              <div className="flex items-start gap-2 bg-[#3D2B05] p-3 rounded-lg border border-white/20">
                <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Apply perfumes, hairsprays, and cosmetics <strong>before</strong> putting on your pearl jewelry.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#3D2B05] p-3 rounded-lg border border-white/20">
                <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Wipe gently with a soft microfibre cloth after wearing to remove body oils and perspiration.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#3D2B05] p-3 rounded-lg border border-white/20">
                <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Store separately in our provided velvet pouch to prevent scratches from harder gemstones.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#442F05] border-t border-white/20 px-6 py-4 text-right">
          <button
            onClick={() => setIsPearlGuideOpen(false)}
            className="px-6 py-2.5 bg-white text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-100 transition-colors shadow"
          >
            {language === 'en' ? 'Close Guide' : 'បិទ'}
          </button>
        </div>

      </div>
    </div>
  );
};
