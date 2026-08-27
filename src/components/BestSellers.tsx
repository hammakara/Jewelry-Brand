import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Eye, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

export const BestSellers: React.FC = () => {
  const { products, settings, viewProductDetails, openOrderModal, language, setCurrentPage } = useStore();

  const featuredList = products.filter(p => p.isBestSeller || p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 bg-[#694D0C] border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{language === 'en' ? 'TIMELESS FAVORITES' : 'ម៉ូដពេញនិយមបំផុត'}</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
              {language === 'en' ? 'Most Coveted Pearl Jewelry' : 'គ្រឿងអលង្ការគុជខ្យងលក់ដាច់បំផុត'}
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors"
          >
            <span>{language === 'en' ? 'View All Catalog' : 'មើលកាតាឡុកទាំងអស់'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((product, index) => {
            const priceKhr = product.price * settings.exchangeRateKhr;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ 
                  duration: 0.55, 
                  delay: (index % 4) * 0.1, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="group bg-[#4D3708] rounded-xl overflow-hidden border border-white/20 hover:border-white transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative aspect-square overflow-hidden bg-[#382704] cursor-pointer" onClick={() => viewProductDetails(product.id)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isBestSeller && (
                      <span className="bg-white text-[#523D0C] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow">
                        Best Seller
                      </span>
                    )}
                    <span className="bg-[#382704]/90 text-white text-[10px] font-medium px-2 py-0.5 rounded border border-white/25 shadow">
                      {product.pearlType} Pearl
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewProductDetails(product.id);
                      }}
                      className="p-2.5 bg-[#382704] text-white rounded-full hover:bg-white hover:text-[#523D0C] transition-colors shadow-lg border border-white/30"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderModal(product);
                      }}
                      className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] font-bold text-xs uppercase tracking-wider rounded shadow-lg transition-colors flex items-center gap-1.5"
                      title="Contact to Order"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#523D0C]" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-white mb-1">
                      <Star className="w-3 h-3 fill-white text-white" />
                      <span className="text-[11px] font-bold text-white">{product.rating || 5.0}</span>
                      <span className="text-[10px] text-white/70">({product.reviewCount || 20})</span>
                    </div>

                    <h3 
                      onClick={() => viewProductDetails(product.id)}
                      className="font-serif-luxury text-base font-bold text-white hover:text-white/90 transition-colors cursor-pointer line-clamp-1"
                    >
                      {language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}
                    </h3>

                    <p className="text-[11px] text-white/75 mt-1 line-clamp-1">
                      {product.size} &bull; {product.material}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-white/50 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/75">
                        ~{priceKhr.toLocaleString()} KHR
                      </div>
                    </div>

                    <button
                      onClick={() => openOrderModal(product)}
                      className="px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded shadow transition-all"
                    >
                      {language === 'en' ? 'Order' : 'កុម្ម៉ង់'}
                    </button>
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
