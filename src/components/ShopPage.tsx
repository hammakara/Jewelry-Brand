import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Eye, 
  ShoppingBag, 
  Star, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { PearlType, Product } from '../types';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategorySlug, 
    setSelectedCategorySlug, 
    viewProductDetails, 
    openOrderModal, 
    settings, 
    language 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPearlType, setSelectedPearlType] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(600);

  // Find active category ID from slug
  const activeCategoryId = useMemo(() => {
    if (!selectedCategorySlug) return 'all';
    const match = categories.find(c => c.slug === selectedCategorySlug);
    return match ? match.id : 'all';
  }, [selectedCategorySlug, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategoryId !== 'all' && p.categoryId !== activeCategoryId) {
        return false;
      }
      // Pearl Type filter
      if (selectedPearlType !== 'all' && p.pearlType !== selectedPearlType) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== 'all' && p.material !== selectedMaterial) {
        return false;
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesKhmer = p.nameKhmer && p.nameKhmer.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesPearl = p.pearlType.toLowerCase().includes(q);
        if (!matchesName && !matchesKhmer && !matchesDesc && !matchesSku && !matchesPearl) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, activeCategoryId, selectedPearlType, selectedMaterial, maxPrice, searchQuery, sortBy]);

  const pearlTypes: Array<{ label: string; value: string }> = [
    { label: 'All Pearls', value: 'all' },
    { label: 'Freshwater (ទឹកសាប)', value: 'Freshwater' },
    { label: 'Akoya (ជប៉ុន Akoya)', value: 'Akoya' },
    { label: 'Tahitian (គុជខ្មៅ)', value: 'Tahitian' },
    { label: 'South Sea (សមុទ្រខាងត្បូង)', value: 'South Sea' },
    { label: 'Baroque (គុជរាងសេរី)', value: 'Baroque' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'MAISON CATALOG' : 'កាតាឡុកគុជខ្យងប្រណីត'}</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#F8F5EE]">
            {language === 'en' ? 'Fine Pearl Jewelry Collection' : 'បណ្តុំគ្រឿងអលង្ការគុជខ្យង'}
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F5EE]/60">
            {language === 'en'
              ? 'Explore our full boutique catalog. Select any piece to view complete gemological specifications or place an order request directly with our concierge.'
              : 'ជ្រើសរើសម៉ូដដែលអ្នកពេញចិត្ត ដើម្បីមើលព័ត៌មានលម្អិត ឬផ្ញើសំណើកុម្ម៉ង់ទិញភ្លាមៗ។'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
              !selectedCategorySlug
                ? 'bg-[#C9A227] text-[#0B0B0B] shadow-[0_2px_10px_rgba(201,162,39,0.3)]'
                : 'bg-[#141414] text-[#F8F5EE]/70 hover:text-[#F8F5EE] border border-gray-800'
            }`}
          >
            {language === 'en' ? 'All Collections' : 'ទាំងអស់'} ({products.length})
          </button>
          
          {categories.map((c) => {
            const isSelected = selectedCategorySlug === c.slug;
            const count = products.filter(p => p.categoryId === c.id).length;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategorySlug(c.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#C9A227] text-[#0B0B0B] shadow-[0_2px_10px_rgba(201,162,39,0.3)]'
                    : 'bg-[#141414] text-[#F8F5EE]/70 hover:text-[#F8F5EE] border border-gray-800'
                }`}
              >
                {language === 'km' && c.nameKhmer ? c.nameKhmer : c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#141414] border border-[#C9A227]/20 rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search by title, pearl type, SKU (e.g. Akoya, Necklace, MDP-NK)...' : 'ស្វែងរកតាមឈ្មោះ គុជ ឬកូដទំនិញ...'}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none pl-9"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Pearl Type Dropdown */}
            <div>
              <select
                value={selectedPearlType}
                onChange={(e) => setSelectedPearlType(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
              >
                {pearlTypes.map((pt) => (
                  <option key={pt.value} value={pt.value} className="bg-[#141414] text-white">{pt.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
              >
                <option value="featured" className="bg-[#141414] text-white">Sort: Featured & Popular</option>
                <option value="price-asc" className="bg-[#141414] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#141414] text-white">Price: High to Low</option>
                <option value="newest" className="bg-[#141414] text-white">Newest Additions</option>
              </select>
            </div>

          </div>

          {/* Quick Active Filters Summary & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800 text-xs text-gray-400">
            <div>
              Showing <strong className="text-[#E6C766]">{filteredProducts.length}</strong> of {products.length} luxury pieces
            </div>

            {(selectedCategorySlug || selectedPearlType !== 'all' || searchQuery || sortBy !== 'featured') && (
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setSelectedPearlType('all');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="text-[#C9A227] hover:underline font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const priceKhr = product.price * settings.exchangeRateKhr;

              return (
                <div
                  key={product.id}
                  className="group bg-[#141414] rounded-lg overflow-hidden border border-[#C9A227]/20 hover:border-[#C9A227] transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(201,162,39,0.15)] flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div
                    className="relative aspect-square overflow-hidden bg-[#1A1A1A] cursor-pointer"
                    onClick={() => viewProductDetails(product.id)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.isBestSeller && (
                        <span className="bg-[#0B0B0B]/90 text-[#E6C766] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#C9A227]/40 shadow">
                          Best Seller
                        </span>
                      )}
                      <span className="bg-[#0B0B0B]/90 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded border border-gray-700 shadow">
                        {product.pearlType}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3">
                      {product.availability === 'limited' ? (
                        <span className="bg-amber-950/90 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-700">
                          Limited
                        </span>
                      ) : product.availability === 'made_to_order' ? (
                        <span className="bg-purple-950/90 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded border border-purple-700">
                          Made to Order
                        </span>
                      ) : (
                        <span className="bg-emerald-950/90 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-700">
                          In Stock
                        </span>
                      )}
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

                  {/* Product Details Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span>SKU: {product.sku}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="font-bold text-gray-300">{product.rating || 5.0}</span>
                        </div>
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
                        className="px-3.5 py-1.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        {language === 'en' ? 'Contact to Order' : 'កុម្ម៉ង់'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#C9A227] mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8F5EE]">
              No Products Found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No pearl pieces matched your selected filters. Try broadening your criteria or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setSelectedPearlType('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-[#C9A227] text-[#0B0B0B] text-xs uppercase tracking-wider font-bold rounded"
            >
              Show All Products
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
