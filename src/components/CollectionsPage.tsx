import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setCurrentPage, language } = useStore();

  const curatedSuites = [
    {
      id: 'suite-1',
      title: 'The Royal Akoya Bridal Suite',
      titleKhmer: 'កម្រងឈុតគុជខ្យងកូនក្រមុំ Akoya',
      tag: 'Bridal & Gala',
      description: 'Japanese Akoya pearls renowned for their mirror-like lustre, paired with 18K solid gold clasps and sparkling diamond accents.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      categorySlug: 'pearl-set'
    },
    {
      id: 'suite-2',
      title: 'Midnight Tahitian Mystique',
      titleKhmer: 'កម្រងគុជខ្យងខ្មៅតាហ៊ីទីអាថ៌កំបាំង',
      tag: 'Exotic Rarity',
      description: 'Naturally dark saltwater pearls from the South Pacific boasting iridescent peacock green, aubergine, and graphite undertones.',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
      categorySlug: 'pearl-necklace'
    },
    {
      id: 'suite-3',
      title: 'Imperial Golden South Sea',
      titleKhmer: 'កម្រងគុជខ្យងមាស South Sea អភិជន',
      tag: 'Prestige & Wealth',
      description: 'The golden queen of gems. Deep natural golden hues harvested from pristine Australian and Philippine waters.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      categorySlug: 'pearl-ring'
    },
    {
      id: 'suite-4',
      title: 'Everyday Minimalist Freshwater',
      titleKhmer: 'កម្រងគុជខ្យងទឹកសាបប្រចាំថ្ងៃ',
      tag: 'Daily Luxury',
      description: 'Solid nacre organic pearls crafted into huggie earrings, pendant chains, and tennis bracelets made for contemporary lifestyle.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      categorySlug: 'pearl-earrings'
    }
  ];

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'CURATED HIGH JEWELRY' : 'កម្រងគុជខ្យងពិសេសៗ'}</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#F8F5EE]">
            {language === 'en' ? 'Signature Pearl Suites' : 'កម្រងគ្រឿងអលង្ការប្រណីត'}
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F5EE]/60">
            {language === 'en'
              ? 'Discover bespoke thematic collections designed for weddings, black-tie galas, and timeless everyday glamour.'
              : 'សម្រិតសម្រាំងសម្រាប់ពិធីមង្គលការ កម្មវិធីលំដាប់ខ្ពស់ និងការតុបតែងខ្លួនប្រចាំថ្ងៃ។'}
          </p>
        </div>

        {/* Curated Suites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {curatedSuites.map((suite) => (
            <div
              key={suite.id}
              onClick={() => navigateToCategory(suite.categorySlug)}
              className="group cursor-pointer bg-[#141414] rounded-2xl overflow-hidden border border-[#C9A227]/20 hover:border-[#C9A227] shadow-sm hover:shadow-[0_8px_30px_rgba(201,162,39,0.2)] transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                <img
                  src={suite.image}
                  alt={suite.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6C766] bg-[#0B0B0B]/90 px-2.5 py-1 rounded border border-[#C9A227]/40 inline-block mb-2">
                    {suite.tag}
                  </span>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold leading-snug text-[#F8F5EE]">
                    {language === 'km' && suite.titleKhmer ? suite.titleKhmer : suite.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {suite.description}
                </p>

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs font-bold text-[#E6C766] group-hover:text-white transition-colors">
                  <span className="uppercase tracking-widest">
                    {language === 'en' ? 'Explore This Suite' : 'មើលទំនិញក្នុងឈុតនេះ'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#C9A227]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Categories Pill Bar */}
        <div className="bg-[#141414] text-[#F8F5EE] rounded-2xl p-8 sm:p-10 border border-[#C9A227]/30 text-center space-y-6">
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
            {language === 'en' ? 'Looking for a Specific Category?' : 'ចង់ស្វែងរកតាមប្រភេទជាក់លាក់?'}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => navigateToCategory(c.slug)}
                className="px-5 py-2.5 rounded-full bg-[#0B0B0B] hover:bg-[#C9A227] text-gray-200 hover:text-[#0B0B0B] border border-gray-800 hover:border-[#C9A227] text-xs uppercase font-semibold tracking-wider transition-all shadow-sm"
              >
                {language === 'km' && c.nameKhmer ? c.nameKhmer : c.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
