import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedCollections: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setCurrentPage, language } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#705210] border-b border-white/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-14"
        >
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{language === 'en' ? 'CURATED CATEGORIES' : 'កម្រងប្រភេទគុជខ្យង'}</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
            {language === 'en' ? 'Explore Our Signature Collections' : 'ស្វែងរកបណ្តុំគ្រឿងអលង្ការលេចធ្លោ'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80">
            {language === 'en'
              ? 'Each category showcases exceptional craftsmanship with organically harvested pearls.'
              : 'រាល់ម៉ូដត្រូវបានច្នៃឡើងយ៉ាងល្អិតល្អន់ ដើម្បីផ្តល់នូវភាពទាក់ទាញបំផុត។'}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category, index) => {
            const count = products.filter(p => p.categoryId === category.id).length;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: (index % 3) * 0.12, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                onClick={() => handleCategoryClick(category.slug)}
                className="group cursor-pointer relative bg-[#4D3708] rounded-xl overflow-hidden border border-white/25 hover:border-white transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] flex flex-col"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative h-64 overflow-hidden bg-[#382704]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F03]/90 via-[#2E1F03]/30 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] uppercase tracking-widest text-white/90 font-bold bg-[#63490D]/80 px-2 py-0.5 rounded border border-white/20">
                      {count} {language === 'en' ? 'Pieces' : 'ម៉ូដ'}
                    </span>
                    <h3 className="font-serif-luxury text-2xl font-bold mt-1.5 text-white">
                      {language === 'km' && category.nameKhmer ? category.nameKhmer : category.name}
                    </h3>
                  </div>
                </div>

                {/* Card footer description */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-[#4D3708]">
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {language === 'km' && category.descriptionKhmer ? category.descriptionKhmer : category.description}
                  </p>
                  
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-white group-hover:text-white transition-colors">
                    <span className="tracking-wider uppercase">
                      {language === 'en' ? 'View Category' : 'ទស្សនាទំនិញ'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
