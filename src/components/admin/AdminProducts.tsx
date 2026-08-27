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
          <p className="text-xs text-white/80">
            Manage your boutique catalog, pricing, gemological specs, and imagery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pearl Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#523B08] border border-white/20 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-md">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, pearl type..."
            className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white placeholder-white/50 outline-none pl-9"
          />
          <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 top-2.5" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-white/80 font-medium">Category:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#3D2B05] border border-white/30 text-xs text-white rounded-lg px-3 py-2 outline-none font-medium"
          >
            <option value="all" className="bg-[#3D2B05]">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#3D2B05]">{c.name}</option>
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
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pearl & Specs</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
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
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-white/30 bg-[#352504] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif-luxury font-bold text-white text-sm truncate max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-white/70 font-mono">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-medium text-white/90">
                      {cat?.name || 'Unassigned'}
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{product.pearlType} ({product.size})</div>
                      <div className="text-[10px] text-white/70">{product.material} &bull; {product.lustre}</div>
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
                          {product.availability}
                        </span>
                        {product.isFeatured && (
                          <span className="text-[9px] text-amber-300 font-bold">★ Featured</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded transition-colors"
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
                          className="p-1.5 bg-[#3D2B05] hover:bg-rose-600 text-white rounded transition-colors"
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
          <div className="relative w-full max-w-3xl bg-[#523B08] text-white border border-white/20 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            <div className="bg-[#3D2B05] border-b border-white/20 px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-display-luxury text-lg font-bold text-white">
                {editingProduct ? 'EDIT PEARL PIECE' : 'ADD NEW PEARL PIECE'}
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
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aura Princess Freshwater Pearl Necklace"
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Product Title (Khmer)
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
                    SKU Code *
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
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#3D2B05]">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Price (USD) *
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
                    Pearl Variety
                  </label>
                  <select
                    value={formData.pearlType}
                    onChange={(e) => setFormData({ ...formData, pearlType: e.target.value as PearlType })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Freshwater" className="bg-[#3D2B05]">Freshwater (ទឹកសាប)</option>
                    <option value="Akoya" className="bg-[#3D2B05]">Japanese Akoya</option>
                    <option value="Tahitian" className="bg-[#3D2B05]">Tahitian Black (តាហ៊ីទី)</option>
                    <option value="South Sea" className="bg-[#3D2B05]">Golden/White South Sea</option>
                    <option value="Baroque" className="bg-[#3D2B05]">Baroque Organic</option>
                    <option value="Mabe" className="bg-[#3D2B05]">Mabe Pearl</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Pearl Size (mm)
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 8.0 - 8.5 mm"
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Metal Material
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value as MetalMaterial })}
                    className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="925 Sterling Silver" className="bg-[#3D2B05]">925 Sterling Silver</option>
                    <option value="18K Yellow Gold" className="bg-[#3D2B05]">18K Yellow Gold</option>
                    <option value="18K White Gold" className="bg-[#3D2B05]">18K White Gold</option>
                    <option value="18K Rose Gold" className="bg-[#3D2B05]">18K Rose Gold</option>
                    <option value="Platinum Plated" className="bg-[#3D2B05]">Platinum Plated</option>
                  </select>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white">
                  Product Photography (URLs)
                </label>

                {/* Preset Picker */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/80">
                  <span>Quick High-Res Presets:</span>
                  {photoPresets.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: [pr.url, ...prev.images] }))}
                      className="px-2 py-0.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded border border-white/20 text-[10px] transition-colors font-medium"
                    >
                      + {pr.label}
                    </button>
                  ))}
                </div>

                {/* Current Images Thumbnails */}
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/30 group">
                      <img src={img} alt="Product preview" className="w-full h-full object-cover" />
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
                    placeholder="Add direct image URL (https://...)"
                    className="flex-1 bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white text-xs font-bold rounded-lg border border-white/20 transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    English Description
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
                    Khmer Description
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
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-white focus:ring-0"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-white/30 text-white text-xs font-bold rounded-lg hover:bg-[#3D2B05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md"
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
