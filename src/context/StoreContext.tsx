import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, Category, OrderRequest, Customer, StoreSettings, PageView, Language, OrderStatus } from '../types';
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

  // Data
  products: Product[];
  categories: Category[];
  orders: OrderRequest[];
  customers: Customer[];
  settings: StoreSettings;

  // Actions - Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Actions - Categories
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

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
  }) => OrderRequest;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderAdminNotes: (orderId: string, notes: string) => void;
  deleteOrder: (orderId: string) => void;

  // Actions - Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetToDefaultData: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;

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

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mdp_admin_auth') === 'true';
  });

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

  // Persistent Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mdp_products_v1');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('mdp_categories_v1');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Persistent Orders
  const [orders, setOrders] = useState<OrderRequest[]>(() => {
    try {
      const saved = localStorage.getItem('mdp_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Persistent Settings
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
      const key = o.customerPhone.replace(/\s+/g, '');
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
        existing.ordersCount += 1;
        if (o.status !== 'CANCELLED') {
          existing.totalSpent += o.totalAmount;
        }
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
          existing.name = o.customerName; // latest name
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

  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.name}" created successfully!`, 'success');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast('Product updated successfully.', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed.', 'info');
  };

  const addCategory = (newCat: Omit<Category, 'id'>) => {
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, created]);
    showToast(`Category "${created.name}" added.`, 'success');
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    showToast('Category updated.', 'info');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.', 'info');
  };

  const createOrderRequest = (orderData: {
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
  }) => {
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
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
    showToast(`Order #${orderId} status changed to ${status}.`, 'info');
  };

  const updateOrderAdminNotes = (orderId: string, adminNotes: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, adminNotes, updatedAt: new Date().toISOString() }
          : o
      )
    );
    showToast('Admin note saved.', 'info');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted.`, 'info');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings updated.', 'success');
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem('mdp_products_v1');
    localStorage.removeItem('mdp_categories_v1');
    localStorage.removeItem('mdp_orders_v1');
    localStorage.removeItem('mdp_settings_v1');
    showToast('Store data reset to initial luxury collection.', 'gold');
  };

  const loginAdmin = (passcode: string) => {
    // Default passcodes for demonstration and luxury boutique management: 'admin123' or 'pearl2026' or 'admin'
    if (passcode === 'admin123' || passcode === 'pearl2026' || passcode === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('mdp_admin_auth', 'true');
      showToast('Welcome to Maison des Perles Admin Suite', 'gold');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('mdp_admin_auth');
    setCurrentPage('home');
    showToast('Logged out of Admin Suite', 'info');
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
        products,
        categories,
        orders,
        customers,
        settings,
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
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
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
