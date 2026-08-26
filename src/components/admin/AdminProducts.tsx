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
  Filter
} from 'lucide-react';
import { Product, PearlType, MetalMaterial, PearlColor } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, viewProductDetails } = useStore();

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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            Pearl Jewelry Inventory
          </h2>
          <p className="text-xs text-gray-400">
            Manage your boutique catalog, pricing, gemological specs, and imagery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pearl Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141414] border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, pearl type..."
            className="w-full bg-[#0B0B0B] border border-gray-700 focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none pl-9"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-gray-400">Category:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#0B0B0B] border border-gray-700 text-xs text-gray-200 rounded-lg px-3 py-2 outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#1A1A1A] text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pearl & Specs</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.map((product) => {
                const cat = categories.find(c => c.id === product.categoryId);

                return (
                  <tr key={product.id} className="hover:bg-[#181818] transition-colors">
                    
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover border border-[#C9A227]/30 bg-black shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif-luxury font-bold text-white text-sm truncate max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-[#C9A227] font-mono">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-medium text-gray-300">
                      {cat?.name || 'Unassigned'}
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{product.pearlType} ({product.size})</div>
                      <div className="text-[10px] text-gray-400">{product.material} &bull; {product.lustre}</div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-[#E6C766]">
                      ${product.price}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          product.availability === 'in_stock'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : product.availability === 'limited'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-purple-950 text-purple-400 border border-purple-800'
                        }`}>
                          {product.availability}
                        </span>
                        {product.isFeatured && (
                          <span className="text-[9px] text-[#C9A227] font-semibold">★ Featured</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black text-gray-300 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete product "${product.name}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-rose-600 text-gray-300 hover:text-white rounded transition-colors"
                          title="Delete Product"
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
          <div className="relative w-full max-w-3xl bg-[#0B0B0B] text-[#F8F5EE] border border-[#C9A227]/40 rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            <div className="bg-[#141414] border-b border-[#C9A227]/20 px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-display-luxury text-lg font-bold text-[#F8F5EE]">
                {editingProduct ? 'EDIT PEARL PIECE' : 'ADD NEW PEARL PIECE'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 overflow-y-auto">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aura Princess Freshwater Pearl Necklace"
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Product Title (Khmer)
                  </label>
                  <input
                    type="text"
                    value={formData.nameKhmer}
                    onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                    placeholder="ឧ. ខ្សែកគុជខ្យងទឹកសាប Aura Princess"
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* SKU, Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Gemological Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Pearl Variety
                  </label>
                  <select
                    value={formData.pearlType}
                    onChange={(e) => setFormData({ ...formData, pearlType: e.target.value as PearlType })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Freshwater">Freshwater (ទឹកសាប)</option>
                    <option value="Akoya">Japanese Akoya</option>
                    <option value="Tahitian">Tahitian Black (តាហ៊ីទី)</option>
                    <option value="South Sea">Golden/White South Sea</option>
                    <option value="Baroque">Baroque Organic</option>
                    <option value="Mabe">Mabe Pearl</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Pearl Size (mm)
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 8.0 - 8.5 mm"
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Metal Material
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value as MetalMaterial })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="925 Sterling Silver">925 Sterling Silver</option>
                    <option value="18K Yellow Gold">18K Yellow Gold</option>
                    <option value="18K White Gold">18K White Gold</option>
                    <option value="18K Rose Gold">18K Rose Gold</option>
                    <option value="Platinum Plated">Platinum Plated</option>
                  </select>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-300">
                  Product Photography (URLs)
                </label>

                {/* Preset Picker */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                  <span>Quick High-Res Presets:</span>
                  {photoPresets.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: [pr.url, ...prev.images] }))}
                      className="px-2 py-0.5 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black rounded border border-gray-700 text-[10px]"
                    >
                      + {pr.label}
                    </button>
                  ))}
                </div>

                {/* Current Images Thumbnails */}
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-gray-700 group">
                      <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute inset-0 bg-black/60 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
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
                    placeholder="Add direct image URL (https://...)"
                    className="flex-1 bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black text-xs font-semibold rounded transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    English Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Khmer Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionKhmer}
                    onChange={(e) => setFormData({ ...formData, descriptionKhmer: e.target.value })}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#C9A227] rounded px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-gray-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#C9A227] focus:ring-0"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-[#C9A227] focus:ring-0"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-700 text-gray-300 text-xs font-semibold rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9A227] hover:bg-[#E6C766] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
