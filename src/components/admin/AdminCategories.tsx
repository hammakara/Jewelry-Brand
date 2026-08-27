import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, X, Layers, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    nameKhmer: string;
    slug: string;
    description: string;
    descriptionKhmer: string;
    image: string;
  }>({
    name: '',
    nameKhmer: '',
    slug: '',
    description: '',
    descriptionKhmer: '',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  });

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameKhmer: '',
      slug: '',
      description: '',
      descriptionKhmer: '',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      nameKhmer: cat.nameKhmer || '',
      slug: cat.slug,
      description: cat.description,
      descriptionKhmer: cat.descriptionKhmer || '',
      image: cat.image,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, { ...formData, slug });
    } else {
      addCategory({ ...formData, slug });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            Product Categories
          </h2>
          <p className="text-xs text-white/80">
            Structure your boutique collections (Necklaces, Earrings, Rings, Bridal Sets, etc.).
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const itemCount = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-44 bg-[#352504] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#523B08] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">
                    {itemCount} Products Listed
                  </span>
                  <h3 className="font-serif-luxury text-xl font-bold text-white">
                    {cat.name}
                  </h3>
                  {cat.nameKhmer && (
                    <div className="text-xs text-white/80 font-medium">{cat.nameKhmer}</div>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-white/80 line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/60">/{cat.slug}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (itemCount > 0) {
                          alert(`Cannot delete category with ${itemCount} products. Please reassign products first.`);
                          return;
                        }
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 bg-[#3D2B05] hover:bg-rose-600 text-white rounded transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#523B08] text-white border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h3 className="font-display-luxury text-base font-bold text-white">
                {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pearl Pendants"
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Category Name (Khmer)
                </label>
                <input
                  type="text"
                  value={formData.nameKhmer}
                  onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                  placeholder="ឧ. បន្តោងគុជខ្យង"
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Slug (URL path)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. pearl-pendants"
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/30 text-white text-xs font-bold rounded-lg hover:bg-[#3D2B05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase rounded-lg shadow-md transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
