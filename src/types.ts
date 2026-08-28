export type PearlType = 'Freshwater' | 'Akoya' | 'Tahitian' | 'South Sea' | 'Baroque' | 'Mabe';

export type PearlColor = 'Classic White' | 'Golden South Sea' | 'Peacock Tahitian' | 'Soft Rose Pink' | 'Lavender Cream' | 'Silver Gray';

export type MetalMaterial = '925 Sterling Silver' | '18K Yellow Gold' | '18K White Gold' | '18K Rose Gold' | 'Platinum Plated';

export type OrderStatus = 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameKhmer: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionKhmer: string;
  pearlType: PearlType;
  color: PearlColor;
  size: string; // e.g. "8.5 - 9.0 mm"
  material: MetalMaterial;
  lustre: 'AAA Grade' | 'AAAA Gem Grade' | 'Hanadama Equivalent' | 'Baroque Lustre';
  availability: 'in_stock' | 'limited' | 'made_to_order' | 'out_of_stock';
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameKhmer: string;
  slug: string;
  description: string;
  descriptionKhmer: string;
  image: string;
  itemCount?: number;
}

export interface OrderRequest {
  id: string; // e.g. "PRL-2849"
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  pearlType: string;
  size?: string;
  material?: string;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerTelegram: string;
  customerAddress: string;
  customerCity: string;
  notes?: string;
  adminNotes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  telegram: string;
  address: string;
  orderCount?: number;
  ordersCount?: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface StoreSettings {
  brandName: string;
  storeName?: string;
  tagline: string;
  hotline: string;
  telegramUsername: string;
  telegramGroupLink: string;
  email: string;
  boutiqueAddress: string;
  boutiqueAddressKhmer: string;
  currencySymbol: string;
  exchangeRateKhr: number; // e.g. 4100
  businessHours: string;
  instagramUrl: string;
  facebookUrl: string;
  allowDirectTelegramOrders: boolean;
  adminPasscode?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
  error?: string;
}

export type PageView = 'home' | 'shop' | 'collections' | 'product-detail' | 'about' | 'contact' | 'admin' | 'order-tracker';
export type Language = 'en' | 'km';
