import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Send, 
  Phone, 
  ShieldCheck, 
  Award, 
  ArrowLeft, 
  Star, 
  Check, 
  Truck, 
  Clock, 
  Package, 
  Info,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    categories, 
    setCurrentPage, 
    setSelectedCategorySlug,
    openOrderModal, 
    viewProductDetails, 
    setIsPearlGuideOpen,
    settings, 
    language 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#F8F5EE]">
        <h2 className="text-xl font-bold text-stone-800">Product not found</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="mt-4 px-5 py-2 bg-[#0B0B0B] text-[#E6C766] text-xs font-bold uppercase rounded"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const priceKhr = product.price * settings.exchangeRateKhr;

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const generateTelegramDirectLink = () => {
    const text = encodeURIComponent(
      `💎 *Product Inquiry: ${product.name}*\n` +
      `🏷️ SKU: ${product.sku}\n` +
      `💰 Price: $${product.price}\n` +
      `✨ Pearl Type: ${product.pearlType} (${product.size})\n\n` +
      `Hello Maison des Perles! I am interested in this piece and would like to ask some questions.`
    );
    return `https://t.me/${settings.telegramUsername}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EE] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium overflow-x-auto pb-1">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="hover:text-[#C9A227] transition-colors"
          >
            {language === 'en' ? 'Home' : 'ទំព័រដើម'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <button 
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }} 
            className="hover:text-[#C9A227] transition-colors"
          >
            {language === 'en' ? 'Shop' : 'ទំនិញ'}
          </button>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
              <button 
                onClick={() => {
                  setSelectedCategorySlug(category.slug);
                  setCurrentPage('shop');
                }} 
                className="hover:text-[#C9A227] transition-colors"
              >
                {language === 'km' && category.nameKhmer ? category.nameKhmer : category.name}
              </button>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <span className="text-[#F8F5EE] truncate font-semibold">
            {language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}
          </span>
        </nav>

        {/* Back Button */}
        <div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#F8F5EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Back to all jewelry' : 'ត្រឡប់ទៅកាតាឡុក'}</span>
          </button>
        </div>

        {/* Main Product Layout (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#141414] rounded-2xl border border-[#C9A227]/30 shadow-2xl p-6 sm:p-10">
          
          {/* Left: Images Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#1A1A1A] border border-gray-800">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 opacity-95"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#0B0B0B]/90 text-[#E6C766] text-xs uppercase font-bold tracking-wider px-3 py-1 rounded shadow-md border border-[#C9A227]/40">
                  {product.pearlType} Pearl
                </span>
                {product.isBestSeller && (
                  <span className="bg-[#C9A227] text-[#0B0B0B] text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded shadow">
                    Best Seller
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-full border border-gray-700">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-[#C9A227] shadow-md scale-95' 
                        : 'border-gray-800 hover:border-gray-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Boutique Reassurance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-800 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Certificate Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Luxury Velvet Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Secured Express Delivery</span>
              </div>
            </div>

          </div>

          {/* Right: Specifications & CTA (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="uppercase tracking-widest text-[#C9A227] font-semibold">
                  {category?.name || 'Fine Jewelry'}
                </span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title (EN & Khmer) */}
              <div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F8F5EE] leading-snug">
                  {product.name}
                </h1>
                {product.nameKhmer && (
                  <h2 className="font-serif-luxury text-lg text-gray-400 mt-1 font-medium">
                    {product.nameKhmer}
                  </h2>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 pb-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-200">{product.rating || 5.0}</span>
                <span className="text-xs text-gray-500">({product.reviewCount || 24} reviews)</span>
              </div>

              {/* Price Display */}
              <div className="bg-[#1C1C1C] border border-[#C9A227]/30 p-4 rounded-xl flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-gray-400 font-medium">Boutique Price:</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold text-[#E6C766]">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">Approx. Cambodian Riel:</div>
                  <div className="text-sm font-semibold text-[#E6C766] mt-0.5">
                    ~{priceKhr.toLocaleString()} KHR
                  </div>
                </div>
              </div>

              {/* Detailed Pearl Specifications Table */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-[#1C1C1C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F8F5EE] flex items-center justify-between border-b border-gray-800">
                  <span>Gemological Details</span>
                  <button 
                    onClick={() => setIsPearlGuideOpen(true)}
                    className="text-[#C9A227] hover:underline normal-case font-medium flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Grading Guide</span>
                  </button>
                </div>

                <div className="divide-y divide-gray-800 text-xs">
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-gray-400">Pearl Type:</span>
                    <span className="col-span-2 font-semibold text-white">{product.pearlType} Cultured Pearl</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-gray-400">Color / Tone:</span>
                    <span className="col-span-2 font-semibold text-white">{product.color}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-gray-400">Pearl Size:</span>
                    <span className="col-span-2 font-semibold text-white">{product.size}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-gray-400">Material / Metal:</span>
                    <span className="col-span-2 font-semibold text-white">{product.material}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-gray-400">Lustre Grade:</span>
                    <span className="col-span-2 font-semibold text-[#E6C766]">{product.lustre}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-gray-400">Availability:</span>
                    <span className="col-span-2 font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>
                        {product.availability === 'in_stock' ? 'In Stock (Ready to Deliver)' : product.availability === 'limited' ? 'Limited Edition' : 'Made to Order'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F5EE]">
                  {language === 'en' ? 'Piece Description' : 'ការពិពណ៌នាអំពីផលិតផល'}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {product.description}
                </p>
                {product.descriptionKhmer && (
                  <p className="text-xs text-gray-400 leading-relaxed italic pt-1">
                    {product.descriptionKhmer}
                  </p>
                )}
              </div>

            </div>

            {/* Actions: Primary CONTACT TO ORDER */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => openOrderModal(product)}
                className="w-full py-4 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] font-display-luxury text-sm font-bold tracking-[0.2em] uppercase rounded-xl shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:shadow-[0_6px_22px_rgba(201,162,39,0.55)] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'en' ? 'CONTACT TO ORDER' : 'ស្នើសុំកុម្ម៉ង់ទិញផលិតផលនេះ'}</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={generateTelegramDirectLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-[#1C1C1C] hover:bg-[#252525] border border-gray-700 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Ask on Telegram</span>
                </a>

                <a
                  href={`tel:${settings.hotline}`}
                  className="flex-1 py-3 border border-gray-700 hover:border-[#C9A227] text-gray-300 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Call Boutique</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#F8F5EE]">
                {language === 'en' ? 'Complementary Pearl Pieces' : 'គ្រឿងអលង្ការដែលសាកសមជាមួយគ្នា'}
              </h3>
              <button
                onClick={() => {
                  setSelectedCategorySlug(category?.slug || null);
                  setCurrentPage('shop');
                }}
                className="text-xs font-semibold text-[#C9A227] hover:underline"
              >
                View Category &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => viewProductDetails(rel.id)}
                  className="bg-[#141414] border border-[#C9A227]/20 hover:border-[#C9A227] p-4 rounded-xl cursor-pointer shadow-sm hover:shadow-lg transition-all flex gap-4 items-center group"
                >
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-20 h-20 object-cover rounded-lg bg-[#1A1A1A] group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#C9A227] font-semibold uppercase">{rel.pearlType}</span>
                    <h4 className="font-serif-luxury text-sm font-bold text-[#F8F5EE] truncate mt-0.5">
                      {rel.name}
                    </h4>
                    <div className="text-xs font-bold text-[#E6C766] mt-1">${rel.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
