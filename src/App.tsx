import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { FeaturedCollections } from './components/FeaturedCollections';
import { BestSellers } from './components/BestSellers';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CollectionsPage } from './components/CollectionsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { OrderModal } from './components/OrderModal';
import { PearlGuideModal } from './components/PearlGuideModal';
import { OrderTracker } from './components/OrderTracker';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { currentPage } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // When inside Admin, render AdminLayout independently
  if (currentPage === 'admin') {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#7B5B12] text-white selection:bg-white selection:text-[#523D0C]">
      {/* Global Luxury Navigation */}
      <Navbar />

      {/* Main Routed Content with Animated Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {currentPage === 'home' && (
              <>
                <HomeHero />
                <FeaturedCollections />
                <BestSellers />
                <CraftsmanshipSection />
              </>
            )}

            {currentPage === 'shop' && <ShopPage />}

            {currentPage === 'product-detail' && <ProductDetailPage />}

            {currentPage === 'collections' && <CollectionsPage />}

            {currentPage === 'about' && <AboutPage />}

            {currentPage === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Luxury Footer */}
      <Footer />

      {/* Customer Modals & Overlays */}
      <OrderModal />
      <PearlGuideModal />
      <OrderTracker />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
