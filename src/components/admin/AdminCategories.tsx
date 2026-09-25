import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit2, Trash2, X, Layers, Image as ImageIcon, UploadCloud, Loader2 } from 'lucide-react';
import { Category } from '../../types';

const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, language, authToken } = useStore();
  const numberFormatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'km-KH');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    image: DEFAULT_CATEGORY_IMAGE,
  });

  const openAdd = () => {
    setEditingCategory(null);
    setUploadError('');
    setFormData({
      name: '',
      nameKhmer: '',
      slug: '',
      description: '',
      descriptionKhmer: '',
      image: DEFAULT_CATEGORY_IMAGE,
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setUploadError('');
    setFormData({
      name: cat.name,
      nameKhmer: cat.nameKhmer || '',
      slug: cat.slug,
      description: cat.description,
      descriptionKhmer: cat.descriptionKhmer || '',
      image: cat.image || DEFAULT_CATEGORY_IMAGE,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(language === 'en' ? 'Please select a JPG, PNG, or WEBP image.' : 'សូមជ្រើសរើសរូបភាព JPG, PNG ឬ WEBP។');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError(language === 'en' ? 'Image must be under 8 MB.' : 'ទំហំរូបភាពមិនអាចលើស ៨ MB ទេ។');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('FILE_READ_FAILED'));
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
      if (!res.ok || typeof data.url !== 'string' || !data.url) {
        throw new Error(`UPLOAD_FAILED_${res.status}`);
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error('Category image upload error:', err);
      setUploadError(language === 'en'
        ? 'Unable to upload the image. Check your connection and Cloudinary configuration.'
        : 'មិនអាចទាញយករូបភាពបានទេ។ សូមពិនិត្យការតភ្ជាប់ និងការកំណត់ Cloudinary។');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || isUploading || isSaving) return;

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-');
    setIsSaving(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { ...formData, slug });
      } else {
        await addCategory({ ...formData, slug });
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            {language === 'en' ? 'Product Categories' : 'ប្រភេទទំនិញ'}
          </h2>
          <p className="text-xs text-white/80">
            {language === 'en' ? 'Structure your boutique collections (Necklaces, Earrings, Rings, Bridal Sets, etc.).' : 'រៀបចំបណ្តុំទំនិញរបស់អ្នក (ខ្សែក ក្រវិល ចិញ្ចៀន ឈុតរៀបការ ជាដើម)។'}
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'Add New Category' : 'បន្ថែមប្រភេទថ្មី'}</span>
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
                  src={cat.image || DEFAULT_CATEGORY_IMAGE}
                  alt={language === 'km' && cat.nameKhmer ? cat.nameKhmer : cat.name}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#523B08] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">
                    {language === 'en' ? `${numberFormatter.format(itemCount)} Products Listed` : `បានចុះបញ្ជីផលិតផល ${numberFormatter.format(itemCount)}`}
                  </span>
                  <h3 className="font-serif-luxury text-xl font-bold text-white">
                    {language === 'km' && cat.nameKhmer ? cat.nameKhmer : cat.name}
                  </h3>
                  {language === 'en' && cat.nameKhmer && (
                    <div className="text-xs text-white/80 font-medium">{cat.nameKhmer}</div>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-white/80 line-clamp-2">
                  {language === 'km' && cat.descriptionKhmer ? cat.descriptionKhmer : cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/60">/{cat.slug}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 bg-[#3D2B05] hover:bg-white hover:text-[#523D0C] text-white rounded transition-colors"
                      title={language === 'en' ? 'Edit Category' : 'កែប្រែប្រភេទ'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (itemCount > 0) {
                          alert(language === 'en'
                            ? `Cannot delete category with ${numberFormatter.format(itemCount)} products. Please reassign products first.`
                            : `មិនអាចលុបប្រភេទដែលមានផលិតផល ${numberFormatter.format(itemCount)} បានទេ។ សូមផ្ទេរផលិតផលជាមុនសិន។`);
                          return;
                        }
                        if (window.confirm(language === 'en'
                          ? `Delete category "${cat.name}"?`
                          : `លុបប្រភេទ "${language === 'km' && cat.nameKhmer ? cat.nameKhmer : cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 bg-[#3D2B05] hover:bg-rose-600 text-white rounded transition-colors"
                      title={language === 'en' ? 'Delete Category' : 'លុបប្រភេទ'}
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
                {editingCategory
                  ? (language === 'en' ? 'EDIT CATEGORY' : 'កែប្រែប្រភេទទំនិញ')
                  : (language === 'en' ? 'ADD NEW CATEGORY' : 'បន្ថែមប្រភេទថ្មី')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  {language === 'en' ? 'Category Name (English) *' : 'ឈ្មោះប្រភេទ (អង់គ្លេស) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'en' ? 'e.g. Pearl Pendants' : 'ឧ. បន្តោងគុជខ្យង'}
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  {language === 'en' ? 'Category Name (Khmer)' : 'ឈ្មោះប្រភេទ (ខ្មែរ)'}
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
                  {language === 'en' ? 'Slug (URL path)' : 'Slug (ផ្លូវ URL)'}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={language === 'en' ? 'e.g. pearl-pendants' : 'ឧ. pearl-pendants'}
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-white mb-1">
                  {language === 'en' ? 'Category Cover Image' : 'រូបភាពបិទបាំងប្រភេទ'}
                </label>

                <div className="relative h-40 overflow-hidden rounded-xl border border-white/25 bg-[#3D2B05]">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={language === 'en' ? 'Category cover preview' : 'មើលជាមុនរូបភាពបិទបាំងប្រភេទ'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/60">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">{language === 'en' ? 'No image selected' : 'មិនទាន់ជ្រើសរើសរូបភាព'}</span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/65 flex items-center justify-center gap-2 text-xs font-bold text-white">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'en' ? 'Uploading...' : 'កំពុងទាញយក...'}
                    </div>
                  )}
                </div>

                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => {
                    setUploadError('');
                    setFormData({ ...formData, image: e.target.value });
                  }}
                  placeholder={language === 'en' ? 'https://...' : 'https://...'}
                  className="w-full bg-[#3D2B05] border border-white/30 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSaving}
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

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  {language === 'en' ? 'Description' : 'ការពិពណ៌នា'}
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
                  {language === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isSaving}
                  className="px-5 py-2 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase rounded-lg shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? (language === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...')
                    : editingCategory
                      ? (language === 'en' ? 'Update' : 'ធ្វើបច្ចុប្បន្នភាព')
                      : (language === 'en' ? 'Create' : 'បង្កើត')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
