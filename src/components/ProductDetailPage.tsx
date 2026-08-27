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
    <div className="min-h-screen bg-[#7B5B12] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-white/80 font-medium overflow-x-auto pb-1">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="hover:text-white transition-colors"
          >
            {language === 'en' ? 'Home' : 'ទំព័រដើម'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-white/60 shrink-0" />
          <button 
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentPage('shop');
            }} 
            className="hover:text-white transition-colors"
          >
            {language === 'en' ? 'Shop' : 'ទំនិញ'}
          </button>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-white/60 shrink-0" />
              <button 
                onClick={() => {
                  setSelectedCategorySlug(category.slug);
                  setCurrentPage('shop');
                }} 
                className="hover:text-white transition-colors"
              >
                {language === 'km' && category.nameKhmer ? category.nameKhmer : category.name}
              </button>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-white/60 shrink-0" />
          <span className="text-white truncate font-bold">
            {language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}
          </span>
        </nav>

        {/* Back Button */}
        <div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors bg-[#523B08] px-3 py-1.5 rounded-lg border border-white/20 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span>{language === 'en' ? 'Back to all jewelry' : 'ត្រឡប់ទៅកាតាឡុក'}</span>
          </button>
        </div>

        {/* Main Product Layout (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#523B08] rounded-2xl border border-white/20 shadow-2xl p-6 sm:p-10">
          
          {/* Left: Images Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#382704] border border-white/25">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 opacity-95"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#382704]/90 text-white text-xs uppercase font-bold tracking-wider px-3 py-1 rounded shadow-md border border-white/30">
                  {product.pearlType} Pearl
                </span>
                {product.isBestSeller && (
                  <span className="bg-white text-[#523D0C] text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded shadow">
                    Best Seller
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 bg-[#382704]/90 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-full border border-white/30 font-bold">
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
                        ? 'border-white shadow-lg scale-95' 
                        : 'border-white/25 hover:border-white/70 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Boutique Reassurance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-white shrink-0" />
                <span>Certificate Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-white shrink-0" />
                <span>Luxury Velvet Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>Secured Express Delivery</span>
              </div>
            </div>

          </div>

          {/* Right: Specifications & CTA (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="uppercase tracking-widest text-white font-bold bg-[#3D2B05] px-2 py-0.5 rounded border border-white/20">
                  {category?.name || 'Fine Jewelry'}
                </span>
                <span className="font-mono text-white/80">SKU: {product.sku}</span>
              </div>

              {/* Title (EN & Khmer) */}
              <div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white leading-snug">
                  {product.name}
                </h1>
                {product.nameKhmer && (
                  <h2 className="font-serif-luxury text-lg text-white/80 mt-1 font-medium">
                    {product.nameKhmer}
                  </h2>
                )}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 pb-2">
                <div className="flex items-center text-white">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating || 5.0}</span>
                <span className="text-xs text-white/70">({product.reviewCount || 24} reviews)</span>
              </div>

              {/* Price Display */}
              <div className="bg-[#3D2B05] border border-white/20 p-4 rounded-xl flex items-baseline justify-between shadow-inner">
                <div>
                  <div className="text-xs text-white/75 font-medium">Boutique Price:</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-white/50 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-white/75">Approx. Cambodian Riel:</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    ~{priceKhr.toLocaleString()} KHR
                  </div>
                </div>
              </div>

              {/* Detailed Pearl Specifications Table */}
              <div className="border border-white/20 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#3D2B05] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between border-b border-white/15">
                  <span>Gemological Details</span>
                  <button 
                    onClick={() => setIsPearlGuideOpen(true)}
                    className="text-white hover:underline normal-case font-bold flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3 text-white" />
                    <span>Grading Guide</span>
                  </button>
                </div>

                <div className="divide-y divide-white/15 text-xs bg-[#442F05]">
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-white/75">Pearl Type:</span>
                    <span className="col-span-2 font-bold text-white">{product.pearlType} Cultured Pearl</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-white/75">Color / Tone:</span>
                    <span className="col-span-2 font-bold text-white">{product.color}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-white/75">Pearl Size:</span>
                    <span className="col-span-2 font-bold text-white">{product.size}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-white/75">Material / Metal:</span>
                    <span className="col-span-2 font-bold text-white">{product.material}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-white/75">Lustre Grade:</span>
                    <span className="col-span-2 font-bold text-white">{product.lustre}</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="text-white/75">Availability:</span>
                    <span className="col-span-2 font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>
                        {product.availability === 'in_stock' ? 'In Stock (Ready to Deliver)' : product.availability === 'limited' ? 'Limited Edition' : 'Made to Order'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === 'en' ? 'Piece Description' : 'ការពិពណ៌នាអំពីផលិតផល'}
                </h4>
                <p className="text-xs text-white/85 leading-relaxed">
                  {product.description}
                </p>
                {product.descriptionKhmer && (
                  <p className="text-xs text-white/75 leading-relaxed italic pt-1">
                    {product.descriptionKhmer}
                  </p>
                )}
              </div>

            </div>

            {/* Actions: Primary CONTACT TO ORDER */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <button
                onClick={() => openOrderModal(product)}
                className="w-full py-4 bg-white hover:bg-neutral-100 text-[#523D0C] font-display-luxury text-sm font-bold tracking-[0.2em] uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#523D0C]" />
                <span>{language === 'en' ? 'CONTACT TO ORDER' : 'ស្នើសុំកុម្ម៉ង់ទិញផលិតផលនេះ'}</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={generateTelegramDirectLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-[#3D2B05] hover:bg-[#342404] border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Ask on Telegram</span>
                </a>

                <a
                  href={`tel:${settings.hotline}`}
                  className="flex-1 py-3 bg-[#3D2B05] hover:bg-[#342404] border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>Call Boutique</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-white/20 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                {language === 'en' ? 'Complementary Pearl Pieces' : 'គ្រឿងអលង្ការដែលសាកសមជាមួយគ្នា'}
              </h3>
              <button
                onClick={() => {
                  setSelectedCategorySlug(category?.slug || null);
                  setCurrentPage('shop');
                }}
                className="text-xs font-bold text-white hover:underline"
              >
                View Category &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => viewProductDetails(rel.id)}
                  className="bg-[#4D3708] border border-white/20 hover:border-white p-4 rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all flex gap-4 items-center group"
                >
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-20 h-20 object-cover rounded-lg bg-[#382704] group-hover:scale-105 transition-transform opacity-95 group-hover:opacity-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-white/80 font-bold uppercase bg-[#382704] px-1.5 py-0.5 rounded">{rel.pearlType}</span>
                    <h4 className="font-serif-luxury text-sm font-bold text-white truncate mt-1">
                      {rel.name}
                    </h4>
                    <div className="text-xs font-bold text-white mt-1">${rel.price}</div>
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
