import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Eye, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';

export const BestSellers: React.FC = () => {
  const { products, settings, viewProductDetails, openOrderModal, language, setCurrentPage } = useStore();

  const featuredList = products.filter(p => p.isBestSeller || p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 bg-[#0E0E0E] border-b border-[#C9A227]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'TIMELESS FAVORITES' : 'ម៉ូដពេញនិយមបំផុត'}</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#F8F5EE]">
              {language === 'en' ? 'Most Coveted Pearl Jewelry' : 'គ្រឿងអលង្ការគុជខ្យងលក់ដាច់បំផុត'}
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E6C766] hover:text-[#C9A227] transition-colors"
          >
            <span>{language === 'en' ? 'View All Catalog' : 'មើលកាតាឡុកទាំងអស់'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((product) => {
            const priceKhr = product.price * settings.exchangeRateKhr;

            return (
              <div
                key={product.id}
                className="group bg-[#141414] rounded-lg overflow-hidden border border-[#C9A227]/20 hover:border-[#C9A227] transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(201,162,39,0.15)] flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative aspect-square overflow-hidden bg-[#1A1A1A] cursor-pointer" onClick={() => viewProductDetails(product.id)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isBestSeller && (
                      <span className="bg-[#0B0B0B]/90 text-[#E6C766] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#C9A227]/40 shadow">
                        Best Seller
                      </span>
                    )}
                    <span className="bg-[#0B0B0B]/90 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded border border-gray-700 shadow">
                      {product.pearlType} Pearl
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewProductDetails(product.id);
                      }}
                      className="p-2.5 bg-[#0B0B0B] text-[#F8F5EE] rounded-full hover:bg-[#C9A227] hover:text-[#0B0B0B] transition-colors shadow-lg border border-gray-700"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderModal(product);
                      }}
                      className="px-4 py-2.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider rounded shadow-lg transition-colors flex items-center gap-1.5"
                      title="Contact to Order"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[11px] font-bold text-gray-300">{product.rating || 5.0}</span>
                      <span className="text-[10px] text-gray-500">({product.reviewCount || 20})</span>
                    </div>

                    <h3 
                      onClick={() => viewProductDetails(product.id)}
                      className="font-serif-luxury text-base font-bold text-[#F8F5EE] hover:text-[#E6C766] transition-colors cursor-pointer line-clamp-1"
                    >
                      {language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}
                    </h3>

                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                      {product.size} &bull; {product.material}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-[#E6C766]">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        ~{priceKhr.toLocaleString()} KHR
                      </div>
                    </div>

                    <button
                      onClick={() => openOrderModal(product)}
                      className="px-3 py-1.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      {language === 'en' ? 'Order' : 'កុម្ម៉ង់'}
                    </button>
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
