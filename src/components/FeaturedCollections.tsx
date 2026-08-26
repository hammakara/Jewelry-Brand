import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedCollections: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setCurrentPage, language } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#0B0B0B] border-b border-[#C9A227]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'CURATED CATEGORIES' : 'កម្រងប្រភេទគុជខ្យង'}</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#F8F5EE]">
            {language === 'en' ? 'Explore Our Signature Collections' : 'ស្វែងរកបណ្តុំគ្រឿងអលង្ការលេចធ្លោ'}
          </h2>
          <p className="text-xs sm:text-sm text-[#F8F5EE]/60">
            {language === 'en'
              ? 'Each category showcases exceptional craftsmanship with organically harvested pearls.'
              : 'រាល់ម៉ូដត្រូវបានច្នៃឡើងយ៉ាងល្អិតល្អន់ ដើម្បីផ្តល់នូវភាពទាក់ទាញបំផុត។'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => {
            const count = products.filter(p => p.categoryId === category.id).length;

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group cursor-pointer relative bg-[#141414] rounded-lg overflow-hidden border border-[#C9A227]/20 hover:border-[#C9A227] transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(201,162,39,0.15)] flex flex-col"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative h-64 overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] uppercase tracking-widest text-[#E6C766] font-semibold">
                      {count} {language === 'en' ? 'Pieces' : 'ម៉ូដ'}
                    </span>
                    <h3 className="font-serif-luxury text-2xl font-bold mt-0.5">
                      {language === 'km' && category.nameKhmer ? category.nameKhmer : category.name}
                    </h3>
                  </div>
                </div>

                {/* Card footer description */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-[#141414]">
                  <p className="text-xs text-[#F8F5EE]/70 line-clamp-2 leading-relaxed">
                    {language === 'km' && category.descriptionKhmer ? category.descriptionKhmer : category.description}
                  </p>
                  
                  <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs font-semibold text-[#F8F5EE] group-hover:text-[#C9A227] transition-colors">
                    <span className="tracking-wider uppercase">
                      {language === 'en' ? 'View Category' : 'ទស្សនាទំនិញ'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
