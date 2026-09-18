import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Package, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  ExternalLink,
  Check,
  Filter,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { Product, PearlType, MetalMaterial, PearlColor } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, viewProductDetails, language, authToken } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    nameKhmer: string;
    categoryId: string;
    price: number;
    originalPrice: number;
    description: string;
    descriptionKhmer: string;
    pearlType: PearlType;
    color: PearlColor;
    size: string;
    material: MetalMaterial;
    lustre: 'AAA Grade' | 'AAAA Gem Grade' | 'Hanadama Equivalent' | 'Baroque Lustre';
    availability: 'in_stock' | 'limited' | 'made_to_order' | 'out_of_stock';
    images: string[];
    isFeatured: boolean;
    isBestSeller: boolean;
    sku: string;
  }>({
    name: '',
    nameKhmer: '',
    categoryId: categories[0]?.id || 'cat-necklace',
    price: 120,
    originalPrice: 150,
    description: '',
    descriptionKhmer: '',
    pearlType: 'Freshwater',
    color: 'Classic White',
    size: '8.0 - 8.5 mm',
    material: '925 Sterling Silver',
    lustre: 'AAA Grade',
    availability: 'in_stock',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'],
    isFeatured: false,
    isBestSeller: false,
    sku: `MDP-${Math.floor(100 + Math.random() * 900)}`,
  });

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sample curated pearl photography presets for quick product additions
  const photoPresets = [
    { label: 'Princess Strand', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Drop Earrings', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Solitaire Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Bridal Set', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Pearl Bracelet', url: 'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Baroque Huggies', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'all' && p.categoryId !== selectedCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.pearlType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setRemovedImageUrls([]);
    setFormData({
      name: '',
      nameKhmer: '',
      categoryId: categories[0]?.id || 'cat-necklace',
      price: 120,
      originalPrice: 150,
      description: 'Lustrous hand-selected pearls mounted with fine precious metal clasp.',
      descriptionKhmer: 'គុជខ្យងធម្មជាតិចែងចាំង ស្រោបដោយលោហៈធាតុមានតម្លៃ។',
      pearlType: 'Freshwater',
      color: 'Classic White',
      size: '8.0 - 8.5 mm',
      material: '925 Sterling Silver',
      lustre: 'AAA Grade',
      availability: 'in_stock',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'],
      isFeatured: false,
      isBestSeller: false,
      sku: `MDP-${Math.floor(100 + Math.random() * 900)}`,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setRemovedImageUrls([]);
    setFormData({
      name: product.name,
      nameKhmer: product.nameKhmer || '',
      categoryId: product.categoryId,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      description: product.description,
      descriptionKhmer: product.descriptionKhmer || '',
      pearlType: product.pearlType,
      color: product.color,
      size: product.size,
      material: product.material,
      lustre: product.lustre,
      availability: product.availability,
      images: product.images,
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      sku: product.sku,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsAddModalOpen(false);
    void deleteRemovedImages();
  };

  const handleAddImageUrl = () => {
    if (customImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, customImageUrl.trim()],
      }));
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const target = formData.images[index];
    if (target && target.includes('res.cloudinary.com')) {
      setRemovedImageUrls((prev) => (prev.includes(target) ? prev : [...prev, target]));
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const deleteRemovedImages = async () => {
    const pending = removedImageUrls;
    setRemovedImageUrls([]);
    if (pending.length === 0) return;

    const headers: Record<string, string> = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    await Promise.all(
      pending.map(async (url) => {
        try {
          await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE', headers });
        } catch (err) {
          console.error('Error deleting image from Cloudinary:', err);
        }
      })
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(language === 'en' ? 'Please select an image file.' : 'សូមជ្រើសរើសឯកសាររូបភាព។');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError(language === 'en' ? 'Image must be under 8 MB.' : 'ទំហំរូបភាពមិនអាចលើស ៨ MB ទេ។');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      if (data.url) {
        setFormData((prev) => ({ ...prev, images: [data.url, ...prev.images] }));
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      setUploadError(err?.message || (language === 'en' ? 'Upload failed. Check Cloudinary config.' : 'ការទាញយកបរាជ័យ។'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            {language === 'en' ? 'Pearl Jewelry Inventory' : 'ស្តុកគ្រឿងអលង្ការគុជខ្យង'}
          </h2>
          <p className="text-xs text-white/80">
            {language === 'en' ? 'Manage your boutique catalog, pricing, gemological specs, and imagery.' : 'គ្រប់គ្រងកាតាឡុក តម្លៃ លក្ខណៈកែវមុខ និងរូបភាពរបស់អ្នក។'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'Add New Pearl Piece' : 'បន្ថែមផលិតផលគុជខ្យងថ្មី'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#523B08] border border-white/20 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-md">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search by title, SKU, pearl type...' : 'ស្វែងរកតាមឈ្មោះ, SKU, ប្រភេទគុជ...'}
            className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white placeholder-white/50 outline-none pl-9"
          />
          <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 top-2.5" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-white/80 font-medium">{language === 'en' ? 'Category:' : 'ប្រភេទ៖'}</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#3D2B05] border border-white/30 text-xs text-white rounded-lg px-3 py-2 outline-none font-medium"
          >
            <option value="all" className="bg-[#3D2B05]">{language === 'en' ? 'All Categories' : 'ប្រភេទទាំងអស់'} ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#3D2B05]">{language === 'km' && c.nameKhmer ? c.nameKhmer : c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/90">
            <thead className="bg-[#3D2B05] text-white/80 uppercase tracking-wider text-[11px] border-b border-white/15">
              <tr>
                <th className="py-3 px-4">{language === 'en' ? 'Item & SKU' : 'ទំនិញនិង SKU'}</th>
                <th className="py-3 px-4">{language === 'en' ? 'Category' : 'ប្រភេទ'}</th>
                <th className="py-3 px-4">{language === 'en' ? 'Pearl & Specs' : 'គុជនិងលក្ខណៈសម្បត្តិ'}</th>
                <th className="py-3 px-4">{language === 'en' ? 'Price' : 'តម្លៃ'}</th>
                <th className="py-3 px-4">{language === 'en' ? 'Status' : 'ស្ថានភាព'}</th>
                <th className="py-3 px-4 text-right">{language === 'en' ? 'Actions' : 'សកម្មភាព'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProducts.map((product) => {
                const cat = categories.find(c => c.id === product.categoryId);

                return (
                  <tr key={product.id} className="hover:bg-[#442F05] transition-colors">
                    
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-white/30 bg-[#352504] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif-luxury font-bold text-white text-sm truncate max-w-xs">
                            {language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}
                          </div>
                          <div className="text-[10px] text-white/70 font-mono">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-medium text-white/90">
                      {cat ? (language === 'km' && cat.nameKhmer ? cat.nameKhmer : cat.name) : (language === 'en' ? 'Unassigned' : 'មិនបានកំណត់')}
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {language === 'km'
                          ? product.pearlType === 'Freshwater' ? 'ទឹកសាប' 
                            : product.pearlType === 'Akoya' ? 'អាគូយ៉ា'
                            : product.pearlType === 'Tahitian' ? 'តាហ៊ីទី'
                            : product.pearlType === 'South Sea' ? 'សមុទ្រខាងត្បូង'
                            : product.pearlType === 'Baroque' ? 'បារុក'
                            : product.pearlType === 'Mabe' ? 'ម៉ាប៊ី'
                            : product.pearlType
                          : product.pearlType} ({product.size})
                      </div>
                      <div className="text-[10px] text-white/70">
                        {language === 'km'
                          ? product.material === '925 Sterling Silver' ? 'ប្រាក់ Sterling 925'
                            : product.material === '18K Yellow Gold' ? 'មាស 18K លឿង'
                            : product.material === '18K White Gold' ? 'មាស 18K ស'
                            : product.material === '18K Rose Gold' ? 'មាស 18K ផ្កាឈូក'
                            : product.material === 'Platinum Plated' ? 'ប្រេប្លាទីន'
                            : product.material
                          : product.material} &bull; {language === 'km'
                          ? product.lustre === 'AAA Grade' ? 'កម្រិត AAA'
                            : product.lustre === 'AAAA Gem Grade' ? 'កម្រិត AAAA ត្បូង'
                            : product.lustre === 'Hanadama Equivalent' ? 'សមមិត្ត Hanadama'
                            : product.lustre === 'Baroque Lustre' ? 'ពន្លឺបារុក'
                            : product.lustre
                          : product.lustre}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${product.price}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          product.availability === 'in_stock'
                            ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-400'
                            : product.availability === 'limited'
                            ? 'bg-amber-900/80 text-amber-200 border border-amber-400'
                            : 'bg-purple-900/80 text-purple-200 border border-purple-400'
                        }`}>
                          {language === 'km'
                            ? product.availability === 'in_stock' ? 'មានស្តុក'
                              : product.availability === 'limited' ? 'មានកំណត់'
                              : product.availability === 'made_to_order' ? 'ផលិតតាមបញ្ជាទិញ'
                              : 'អស់ស្តុក'
                            : product.availability === 'in_stock' ? 'In Stock'
                              : product.availability === 'limited' ? 'Limited'
                              : product.availability === 'made_to_order' ? 'Made to Order'
                              : 'Out of Stock'}
                        </span>
                        {product.isFeatured && (
                          <span className="text-[9px] text-amber-300 font-bold">★ {language === 'en' ? 'Featured' : 'លក្ខណៈពិសេស'}</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded transition-colors"
                          title={language === 'en' ? 'Edit Product' : 'កែប្រែផលិតផល'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(language === 'en'
                              ? `Delete product "${product.name}"?`
                              : `លុបផលិតផល "${language === 'km' && product.nameKhmer ? product.nameKhmer : product.name}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 bg-[#3D2B05] hover:bg-rose-600 text-white rounded transition-colors"
                          title={language === 'en' ? 'Delete Product' : 'លុបផលិតផល'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#523B08] text-white border border-white/20 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            <div className="bg-[#3D2B05] border-b border-white/20 px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-display-luxury text-lg font-bold text-white">
                {editingProduct
                  ? (language === 'en' ? 'EDIT PEARL PIECE' : 'កែប្រែផលិតផលគុជខ្យង')
                  : (language === 'en' ? 'ADD NEW PEARL PIECE' : 'បន្ថែមផលិតផលគុជខ្យងថ្មី')}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 overflow-y-auto">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Product Title (English) *' : 'ចំណងជើងផលិតផល (អង់គ្លេស) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'en' ? 'e.g. Aura Princess Freshwater Pearl Necklace' : 'ឧ. ខ្សែកគុជខ្យង Aura Princess'}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Product Title (Khmer)' : 'ចំណងជើងផលិតផល (ខ្មែរ)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameKhmer}
                    onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                    placeholder="ឧ. ខ្សែកគុជខ្យងទឹកសាប Aura Princess"
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* SKU, Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'SKU Code *' : 'លេខកូដ SKU *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Category *' : 'ប្រភេទ *'}
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#3D2B05]">{language === 'km' && c.nameKhmer ? c.nameKhmer : c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Price (USD) *' : 'តម្លៃ (USD) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Gemological Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Pearl Variety' : 'ប្រភេទគុជខ្យង'}
                  </label>
                  <select
                    value={formData.pearlType}
                    onChange={(e) => setFormData({ ...formData, pearlType: e.target.value as PearlType })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Freshwater" className="bg-[#3D2B05]">{language === 'en' ? 'Freshwater (ទឹកសាប)' : 'ទឹកសាប (Freshwater)'}</option>
                    <option value="Akoya" className="bg-[#3D2B05]">{language === 'en' ? 'Japanese Akoya' : 'អាគូយ៉ាជប៉ុន'}</option>
                    <option value="Tahitian" className="bg-[#3D2B05]">{language === 'en' ? 'Tahitian Black (តាហ៊ីទី)' : 'តាហ៊ីទីខ្មៅ'}</option>
                    <option value="South Sea" className="bg-[#3D2B05]">{language === 'en' ? 'Golden/White South Sea' : 'សមុទ្រខាងត្បូងមាស/ស'}</option>
                    <option value="Baroque" className="bg-[#3D2B05]">{language === 'en' ? 'Baroque Organic' : 'បារុកធម្មជាតិ'}</option>
                    <option value="Mabe" className="bg-[#3D2B05]">{language === 'en' ? 'Mabe Pearl' : 'គុជម៉ាប៊ី'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Pearl Size (mm)' : 'ទំហំគុជ (mm)'}
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder={language === 'en' ? 'e.g. 8.0 - 8.5 mm' : 'ឧ. 8.0 - 8.5 mm'}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Metal Material' : 'លោហៈធាតុ'}
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value as MetalMaterial })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="925 Sterling Silver" className="bg-[#3D2B05]">{language === 'en' ? '925 Sterling Silver' : 'ប្រាក់ Sterling 925'}</option>
                    <option value="18K Yellow Gold" className="bg-[#3D2B05]">{language === 'en' ? '18K Yellow Gold' : 'មាស 18K លឿង'}</option>
                    <option value="18K White Gold" className="bg-[#3D2B05]">{language === 'en' ? '18K White Gold' : 'មាស 18K ស'}</option>
                    <option value="18K Rose Gold" className="bg-[#3D2B05]">{language === 'en' ? '18K Rose Gold' : 'មាស 18K ផ្កាឈូក'}</option>
                    <option value="Platinum Plated" className="bg-[#3D2B05]">{language === 'en' ? 'Platinum Plated' : 'ប្រេប្លាទីន'}</option>
                  </select>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white">
                  {language === 'en' ? 'Product Photography (URLs)' : 'រូបថតផលិតផល (URLs)'}
                </label>

                {/* Preset Picker */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/80">
                  <span>{language === 'en' ? 'Quick High-Res Presets:' : 'ជម្រើសរហ័សរូបភាពគុណភាពខ្ពស់៖'}</span>
                  {photoPresets.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: [pr.url, ...prev.images] }))}
                      className="px-2 py-0.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded border border-white/20 text-[10px] transition-colors font-medium"
                    >
                      + {language === 'km'
                        ? pr.label === 'Princess Strand' ? 'ខ្សែកព្រេសនាថ'
                          : pr.label === 'Drop Earrings' ? 'ក្រវិលច្រាល'
                          : pr.label === 'Solitaire Ring' ? 'ចិញ្ចៀនតែមួយ'
                          : pr.label === 'Bridal Set' ? 'ឈុតការពិសេស'
                          : pr.label === 'Pearl Bracelet' ? 'ខ្សែដៃគុជខ្យង'
                          : 'គុជបារុក'
                        : pr.label}
                    </button>
                  ))}
                </div>

                {/* Current Images Thumbnails */}
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/30 group">
                      <img src={img} alt={language === 'en' ? 'Product preview' : 'រូបភាពផលិតផល'} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute inset-0 bg-black/60 text-rose-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder={language === 'en' ? 'Add direct image URL (https://...)' : 'បន្ថែម URL រូបភាពផ្ទាល់ (https://...)'}
                    className="flex-1 bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white text-xs font-bold rounded-lg border border-white/20 transition-colors"
                  >
                    {language === 'en' ? 'Add URL' : 'បន្ថែម URL'}
                  </button>
                </div>

                {/* Or Upload from Device */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white text-xs font-bold rounded-lg border border-white/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {language === 'en' ? 'Uploading...' : 'កំពុងទាញយក...'}
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        {language === 'en' ? 'Upload Image from Device' : 'ទាញយករូបភាពពីឧបករណ៍'}
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-white/60">
                    {language === 'en' ? 'JPG / PNG / WEBP up to 8 MB. Stored securely on Cloudinary.' : 'ឯកសារ JPG / PNG / WEBP ទំហំរហូតដល់ ៨ MB។ រក្សាទុកដោយសុវត្ថិភាពលើ Cloudinary។'}
                  </span>
                </div>

                {uploadError && (
                  <div className="text-[11px] text-rose-300 font-medium bg-rose-950/40 border border-rose-400/40 rounded-lg px-3 py-2">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'English Description' : 'ការពិពណ៌នាជាភាសាអង់គ្លេស'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    {language === 'en' ? 'Khmer Description' : 'ការពិពណ៌នាជាភាសាខ្មែរ'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionKhmer}
                    onChange={(e) => setFormData({ ...formData, descriptionKhmer: e.target.value })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/20 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-white focus:ring-0"
                  />
                  <span>{language === 'en' ? 'Mark as Featured' : 'កំណត់ជាលក្ខណៈពិសេស'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-white focus:ring-0"
                  />
                  <span>{language === 'en' ? 'Mark as Best Seller' : 'កំណត់ជាលក់ដាច់បំផុត'}</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-white/30 text-white text-xs font-bold rounded-lg hover:bg-[#3D2B05]"
                >
                  {language === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
                >
                  {editingProduct
                    ? (language === 'en' ? 'Save Changes' : 'រក្សាទុកការផ្លាស់ប្តូរ')
                    : (language === 'en' ? 'Create Product' : 'បង្កើតផលិតផល')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
