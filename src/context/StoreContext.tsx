import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category, OrderRequest, Customer, StoreSettings, PageView, Language, OrderStatus, AuthUser } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'gold';
}

interface StoreContextType {
  // Navigation & View
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Modals
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  orderModalProduct: Product | null;
  openOrderModal: (product: Product) => void;
  closeOrderModal: () => void;
  lastCreatedOrder: OrderRequest | null;

  isPearlGuideOpen: boolean;
  setIsPearlGuideOpen: (open: boolean) => void;

  // Authentication State & Modals
  currentUser: AuthUser | null;
  authToken: string | null;
  isAdminLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (open: boolean) => void;
  openChangePasswordModal: () => void;
  closeChangePasswordModal: () => void;

  // Authentication Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; phone?: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;

  // Data
  products: Product[];
  categories: Category[];
  orders: OrderRequest[];
  customers: Customer[];
  settings: StoreSettings;
  isLoadingData: boolean;
  isDbConnected: boolean;

  // Actions - Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Actions - Categories
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Actions - Orders
  createOrderRequest: (orderData: {
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
    pearlType: string;
    size?: string;
    material?: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    customerTelegram: string;
    customerAddress: string;
    customerCity: string;
    notes?: string;
  }) => Promise<OrderRequest>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderAdminNotes: (orderId: string, notes: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Actions - Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  resetToDefaultData: () => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold') => void;
  dismissToast: (id: string) => void;

  // Helper
  viewProductDetails: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<OrderRequest | null>(null);
  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState<boolean>(false);

  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('mdp_jwt_token') || null;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('mdp_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  // Compute isAdminLoggedIn from authenticated user role (ADMIN)
  const isAdminLoggedIn = useMemo(() => {
    if (currentUser && currentUser.role === 'ADMIN') {
      return true;
    }
    return false;
  }, [currentUser]);

  // Database status and loading
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persistent Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mdp_products_v1');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('mdp_categories_v1');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Persistent Orders State
  const [orders, setOrders] = useState<OrderRequest[]>(() => {
    try {
      const saved = localStorage.getItem('mdp_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Persistent Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('mdp_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.brandName === 'Maison des Perles' || !parsed.brandName) {
          return { ...parsed, brandName: 'ប្រណិត (PRANITH)' };
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Helper to build headers with Bearer token if present
  const getAuthHeaders = (extraHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  };

  // Verify stored JWT token on startup
  useEffect(() => {
    async function verifyStoredAuth() {
      if (!authToken) return;
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          localStorage.setItem('mdp_auth_user', JSON.stringify(user));
        } else {
          // Token expired or invalid
          console.warn('Session expired. Logging out.');
          setAuthToken(null);
          setCurrentUser(null);
          localStorage.removeItem('mdp_jwt_token');
          localStorage.removeItem('mdp_auth_user');
        }
      } catch (err) {
        console.error('Error verifying auth session:', err);
      }
    }

    verifyStoredAuth();
  }, [authToken]);

  // Fetch initial data from Backend API on mount
  useEffect(() => {
    async function loadDataFromBackend() {
      setIsLoadingData(true);
      try {
        // Health check
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          if (healthData.connected) {
            setIsDbConnected(true);
          }
        }

        // Fetch categories, products, settings in parallel (public read)
        const [catRes, prodRes, setRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
          fetch('/api/settings'),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
            localStorage.setItem('mdp_categories_v1', JSON.stringify(catData));
          }
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            setProducts(prodData);
            localStorage.setItem('mdp_products_v1', JSON.stringify(prodData));
          }
        }

        if (setRes.ok) {
          const setData = await setRes.json();
          if (setData && typeof setData === 'object') {
            setSettings(setData);
            localStorage.setItem('mdp_settings_v1', JSON.stringify(setData));
          }
        }

        // If authenticated, also fetch orders
        if (authToken) {
          const ordRes = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (ordRes.ok) {
            const ordData = await ordRes.json();
            if (Array.isArray(ordData)) {
              setOrders(ordData);
              localStorage.setItem('mdp_orders_v1', JSON.stringify(ordData));
            }
          }
        }
      } catch (err) {
        console.warn('Could not load data from backend server, falling back to cached state:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadDataFromBackend();
  }, [authToken]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mdp_products_v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mdp_categories_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mdp_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mdp_settings_v1', JSON.stringify(settings));
  }, [settings]);

  // Derived Customers List from Orders
  const customers = useMemo(() => {
    const map = new Map<string, Customer>();
    orders.forEach((o) => {
      const key = (o.customerPhone || '').replace(/\s+/g, '');
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          id: `cust-${key}`,
          name: o.customerName,
          phone: o.customerPhone,
          telegram: o.customerTelegram,
          address: `${o.customerAddress}, ${o.customerCity}`,
          ordersCount: 1,
          totalSpent: o.status !== 'CANCELLED' ? o.totalAmount : 0,
          lastOrderDate: o.createdAt,
        });
      } else {
        const existing = map.get(key)!;
        existing.ordersCount = (existing.ordersCount || 0) + 1;
        if (o.status !== 'CANCELLED') {
          existing.totalSpent += o.totalAmount;
        }
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
          existing.name = o.customerName;
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());
  }, [orders]);

  // Actions
  const viewProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openOrderModal = (product: Product) => {
    setOrderModalProduct(product);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  // ==========================================
  // --- AUTHENTICATION METHODS ---
  // ==========================================

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setAuthToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('mdp_jwt_token', data.token);
      localStorage.setItem('mdp_auth_user', JSON.stringify(data.user));

      showToast(`Welcome back, ${data.user.name}!`, 'gold');
      closeAuthModal();

      // Refresh orders for authenticated user
      try {
        const ordRes = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (Array.isArray(ordData)) {
            setOrders(ordData);
          }
        }
      } catch (err) {
        console.error('Error fetching orders post-login:', err);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setAuthToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('mdp_jwt_token', data.token);
      localStorage.setItem('mdp_auth_user', JSON.stringify(data.user));

      showToast(`Account created! Welcome, ${data.user.name}.`, 'gold');
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('mdp_jwt_token');
    localStorage.removeItem('mdp_auth_user');
    setCurrentPage('home');
    showToast('You have been securely logged out.', 'info');
  };

  const updateProfile = async (data: { name?: string; phone?: string; avatarUrl?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!authToken) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const updatedUser = await res.json();
      if (!res.ok) {
        return { success: false, error: updatedUser.error || 'Failed to update profile' };
      }
      setCurrentUser(updatedUser);
      localStorage.setItem('mdp_auth_user', JSON.stringify(updatedUser));
      showToast('Profile details updated.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!authToken) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to change password' };
      }
      showToast('Password changed successfully.', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const loginAdmin = (passcode: string) => {
    // Backwards compatibility for quick entrance or direct passcode
    if (passcode === 'admin123' || passcode === 'pearl2026' || passcode === 'admin') {
      login('admin@pranith.luxury', 'AdminPassword2026!');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    logout();
  };

  // ==========================================
  // --- DATABASE & CRUD OPERATIONS ---
  // ==========================================

  const addProduct = async (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const tempId = `prod-${Date.now()}`;
    const created: Product = {
      ...newProd,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(created),
      });
      if (res.ok) {
        const savedProd = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === tempId ? savedProd : p)));
        showToast(`Product "${savedProd.name}" saved securely!`, 'success');
      } else {
        showToast(`Product "${created.name}" created locally.`, 'info');
      }
    } catch (err) {
      console.error('Error persisting product to backend:', err);
      showToast(`Product "${created.name}" created locally.`, 'info');
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? saved : p)));
        showToast('Product updated in Neon database.', 'info');
      }
    } catch (err) {
      console.error('Error updating product on backend:', err);
      showToast('Product updated locally.', 'info');
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Product removed from database.', 'info');
    } catch (err) {
      console.error('Error deleting product on backend:', err);
      showToast('Product removed locally.', 'info');
    }
  };

  const addCategory = async (newCat: Omit<Category, 'id'>) => {
    const tempId = `cat-${Date.now()}`;
    const created: Category = {
      ...newCat,
      id: tempId,
    };
    setCategories((prev) => [...prev, created]);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(created),
      });
      if (res.ok) {
        const saved = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === tempId ? saved : c)));
        showToast(`Category "${saved.name}" saved to Neon database.`, 'success');
      }
    } catch (err) {
      console.error('Error adding category on backend:', err);
      showToast(`Category "${created.name}" added locally.`, 'success');
    }
  };

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === id ? saved : c)));
        showToast('Category updated in database.', 'info');
      }
    } catch (err) {
      console.error('Error updating category on backend:', err);
      showToast('Category updated locally.', 'info');
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Category deleted from database.', 'info');
    } catch (err) {
      console.error('Error deleting category on backend:', err);
      showToast('Category deleted locally.', 'info');
    }
  };

  const createOrderRequest = async (orderData: {
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
    pearlType: string;
    size?: string;
    material?: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    customerTelegram: string;
    customerAddress: string;
    customerCity: string;
    notes?: string;
  }): Promise<OrderRequest> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRequest = {
      id: `PRL-${randomNum}`,
      productId: orderData.productId,
      productName: orderData.productName,
      productPrice: orderData.productPrice,
      productImage: orderData.productImage,
      pearlType: orderData.pearlType,
      size: orderData.size,
      material: orderData.material,
      quantity: orderData.quantity,
      totalAmount: orderData.productPrice * orderData.quantity,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerTelegram: orderData.customerTelegram,
      customerAddress: orderData.customerAddress,
      customerCity: orderData.customerCity,
      notes: orderData.notes,
      adminNotes: '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    showToast(`Order Request #${newOrder.id} successfully placed!`, 'gold');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? savedOrder : o)));
        setLastCreatedOrder(savedOrder);
      }
    } catch (err) {
      console.error('Error saving order to backend:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
    showToast(`Order #${orderId} status changed to ${status}.`, 'info');

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('Error updating order status in backend:', err);
    }
  };

  const updateOrderAdminNotes = async (orderId: string, adminNotes: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, adminNotes, updatedAt: new Date().toISOString() }
          : o
      )
    );
    showToast('Admin note saved.', 'info');

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ adminNotes }),
      });
    } catch (err) {
      console.error('Error saving admin note to backend:', err);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted.`, 'info');

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Error deleting order on backend:', err);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    showToast('Store settings updated.', 'success');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setSettings(saved);
      }
    } catch (err) {
      console.error('Error saving settings to backend:', err);
    }
  };

  const resetToDefaultData = async () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem('mdp_products_v1');
    localStorage.removeItem('mdp_categories_v1');
    localStorage.removeItem('mdp_orders_v1');
    localStorage.removeItem('mdp_settings_v1');

    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast('Neon database reset to initial luxury collection.', 'gold');
      } else {
        showToast('Store data reset.', 'gold');
      }
    } catch {
      showToast('Store data reset.', 'gold');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        language,
        setLanguage,
        isOrderModalOpen,
        setIsOrderModalOpen,
        orderModalProduct,
        openOrderModal,
        closeOrderModal,
        lastCreatedOrder,
        isPearlGuideOpen,
        setIsPearlGuideOpen,

        // Auth
        currentUser,
        authToken,
        isAdminLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        isChangePasswordModalOpen,
        setIsChangePasswordModalOpen,
        openChangePasswordModal,
        closeChangePasswordModal,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        loginAdmin,
        logoutAdmin,

        // Data
        products,
        categories,
        orders,
        customers,
        settings,
        isLoadingData,
        isDbConnected,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        createOrderRequest,
        updateOrderStatus,
        updateOrderAdminNotes,
        deleteOrder,
        updateSettings,
        resetToDefaultData,
        toasts,
        showToast,
        dismissToast,
        viewProductDetails,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
