import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProcessGuide from './components/ProcessGuide';
import CraftCatalog from './components/CraftCatalog';
import ProductDetail from './components/ProductDetail';
import BasketView from './components/BasketView';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';

import { MOCK_PRODUCTS } from './data';
import { Product, CartItem } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, ArrowRight, Heart, HeartCrack, ShoppingCart } from 'lucide-react';

export default function App() {
  // Navigation: 'home' | 'shop' | 'product_detail' | 'basket'
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'product_detail' | 'basket'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Theme state synchroniser
  const [selectedThemeId, setSelectedThemeId] = useState<string>('thm-sky');
  
  // App initial shop category deep filter
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<'Bouquet' | 'Keyring' | null>(null);

  // Persistent Basket state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('criscrafts_basket');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Basket added confirmation dialog indicator
  const [addedConfirmItem, setAddedConfirmItem] = useState<CartItem | null>(null);

  // Calendar Promotion state hooks
  const [calendarPromoEnabled, setCalendarPromoEnabled] = useState<boolean>(false);
  const [promoOccasionTag, setPromoOccasionTag] = useState<string>('Everyday');

  // Synchronise basket edits with local storage
  useEffect(() => {
    try {
      localStorage.setItem('criscrafts_basket', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to persist cart items to localStorage:', e);
    }
  }, [cartItems]);

  // Unified Cart mutations
  const handleAddToBasket = (item: CartItem) => {
    setCartItems(prev => {
      // Find similar item matching options, pricing, and custom styles
      const existsIndex = prev.findIndex(p => 
        p.product.id === item.product.id && 
        p.isCustom === item.isCustom &&
        p.customDetailsText === item.customDetailsText &&
        JSON.stringify(p.selectedOptions) === JSON.stringify(item.selectedOptions)
      );

      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = {
          ...copy[existsIndex],
          quantity: copy[existsIndex].quantity + item.quantity
        };
        return copy;
      }
      return [...prev, item];
    });

    // Set interactive added confirm toast
    setAddedConfirmItem(item);
  };

  const handleRemoveFromBasket = (cartId: string) => {
    setCartItems(prev => prev.filter(p => p.cartId !== cartId));
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(p => {
      if (p.cartId === cartId) {
        const nextQty = p.quantity + delta;
        return {
          ...p,
          quantity: nextQty < 1 ? 1 : nextQty
        };
      }
      return p;
    }));
  };

  const handleClearBasket = () => {
    setCartItems([]);
  };

  // TECHNICAL BACKEND COMPATIBILITY HOOK
  // Explicit isolated handler where we can drop in deep REST fetch requests later
  const handleCheckoutSubmit = async (orderData: any) => {
    console.log('--- CRISCRAFTS BACKEND CONNECTIVITY LOG ---');
    console.log('Payload transmitted in isolated technical callback:', orderData);
    // Future database connectivity example:
    // try {
    //   const response = await fetch('/api/orders', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(orderData)
    //   });
    //   return await response.json();
    // } catch(err) { console.error(err); }
  };

  // Direct category clicks from Event banner
  const handleNavigateWithCategory = (category: 'Bouquet' | 'Keyring' | null) => {
    setInitialCategoryFilter(category);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolve global background stylings with specified luxury gradient mesh
  const getAppThemeBackdrop = () => {
    return 'bg-transparent text-slate-900';
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Best selling pre-made items for homepage hero integrations
  const bestSellers = MOCK_PRODUCTS.filter(p => p.popular);

  return (
    <div 
      id="criscrafts-app-root" 
      className={`min-h-screen transition-all duration-700 font-sans pb-12 overflow-x-hidden ${getAppThemeBackdrop()}`}
    >
      {/* DYNAMIC VISUAL OVERHAUL: Fluid Animated Background Layer */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#E0F2FE] via-[#FFFFFF] to-[#F0F7FF] bg-[length:400%_400%] animate-gradient-slow pointer-events-none" />
      
      {/* 1. PERSISTENT STICKY NAVBAR */}
      <Navbar 
        cartCount={totalItemsCount} 
        currentView={activeTab === 'product_detail' ? 'shop' : activeTab as any} 
        onNavigate={(view) => {
          setActiveTab(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. CORE VIEW ROTATOR */}
      <AnimatePresence mode="wait">
        
        {/* VIEW: HOME */}
        {activeTab === 'home' && (
          <motion.div
            key="home-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* HERO PANEL */}
            <Hero onExplore={() => {
              setInitialCategoryFilter(null);
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />

            {/* FEATURED BEST SELLERS ROW */}
            <section id="featured-bento-section" className="py-12 px-4 max-w-7xl mx-auto scroll-mt-24 text-left">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
                <div className="space-y-2">
                  <span className="text-[#0099FF] text-xs font-bold uppercase tracking-wider bg-[#E0F2FE] px-3.5 py-1.5 rounded-full">
                    Aesthetic Choices
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white leading-tight">
                    Our Best Sellers
                  </h2>
                </div>
                
                {/* CALENDAR PROMOTION STRUCTURAL HOOK CONTROLS */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 rounded-full text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${calendarPromoEnabled ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${calendarPromoEnabled ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                    </span>
                    <span>Calendar Promo:</span>
                    <button 
                      onClick={() => {
                        const nextVal = !calendarPromoEnabled;
                        setCalendarPromoEnabled(nextVal);
                        if (nextVal) {
                          setPromoOccasionTag(selectedThemeId === 'thm-mothers' ? 'Mothers' : selectedThemeId === 'thm-fathers' ? 'Fathers' : 'Everyday');
                        }
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide transition-all ${
                        calendarPromoEnabled 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {calendarPromoEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>
                  
                  {calendarPromoEnabled && (
                    <div className="flex gap-1 p-1 bg-white/40 dark:bg-slate-800/40 border border-slate-200/30 rounded-full">
                      {['Everyday', 'Mothers', 'Fathers'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setPromoOccasionTag(tag)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all ${
                            promoOccasionTag === tag 
                              ? 'bg-[#0099FF] text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setInitialCategoryFilter(null);
                      setActiveTab('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-sans font-bold text-xs text-[#0099FF] hover:underline flex items-center gap-1.5 cursor-pointer pl-1"
                  >
                    View All Catalogs <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Horizontally Scrollable Flex Row Container */}
              <div 
                className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-6 px-4 pb-6 w-full"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {bestSellers
                  .filter((product) => {
                    if (!calendarPromoEnabled) return true;
                    if (promoOccasionTag === 'Mothers') {
                      return product.id === 'prod-fuzzy-cloud' || product.id === 'prod-sweet-romance';
                    }
                    if (promoOccasionTag === 'Fathers') {
                      return product.id === 'prod-royal-velvet' || product.id === 'prod-fuzzy-puppy';
                    }
                    return product.id === 'prod-eternal-blossom' || product.id === 'prod-anime-chibi';
                  })
                  .map((product) => (
                    <div 
                      key={product.id} 
                      className="snap-start shrink-0 w-[285px] sm:w-[320px] pb-2"
                    >
                      <ProductCard 
                        product={product}
                        onClick={(p) => {
                          setSelectedProduct(p);
                          setActiveTab('product_detail');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </div>
                  ))}
              </div>
            </section>

            {/* PROCESS GUIDE SECTION */}
            <ProcessGuide />
          </motion.div>
        )}

        {/* VIEW: SHOP filter search catalog */}
        {activeTab === 'shop' && (
          <motion.div
            key="shop-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <CraftCatalog 
              initialCategory={initialCategoryFilter}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setActiveTab('product_detail');
              }}
            />
          </motion.div>
        )}

        {/* VIEW: PRODUCT CUSTOM DETAILS WORKBENCH */}
        {activeTab === 'product_detail' && selectedProduct && (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
            <ProductDetail 
              product={selectedProduct}
              onBack={() => setActiveTab('shop')}
              onAddToBasket={handleAddToBasket}
            />
          </motion.div>
        )}

        {/* VIEW: BASKET AND CHECKOUT ROUTER */}
        {activeTab === 'basket' && (
          <motion.div
            key="basket-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <BasketView 
              cartItems={cartItems}
              onRemoveItem={handleRemoveFromBasket}
              onUpdateQuantity={handleUpdateQuantity}
              onClearBasket={handleClearBasket}
              onContinueShopping={() => setActiveTab('shop')}
              onSubmitCheckout={handleCheckoutSubmit}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* 3. LIQUID GLASS FOOTER */}
      <Footer onNavigate={(view) => {
        setActiveTab(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* ——————— PRODUCT ADDED CONFIRMATION MODAL TOAST ——————— */}
      <AnimatePresence>
        {addedConfirmItem && (
          <div id="added-toast-portal" className="fixed inset-0 z-50 flex items-end justify-center p-6 pointer-events-none md:items-center">
            
            {/* Dark banner barrier */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm pointer-events-auto"
              onClick={() => setAddedConfirmItem(null)}
            />

            {/* Bouncy action container */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-sm p-6 rounded-[2rem] bg-white text-slate-900 pointer-events-auto shadow-2xl border border-slate-100/90 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xl mx-auto">
                🌸
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-slate-900 text-base">
                  Aesthetic Added To Basket!
                </h4>
                <p className="font-sans text-xs text-slate-500 max-w-[250px] mx-auto">
                  "{addedConfirmItem.product.name}" is successfully prepared in your order stack.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                <button
                  id="toast-keep-shopping-btn"
                  onClick={() => setAddedConfirmItem(null)}
                  className="py-3 px-4 rounded-full font-sans text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition cursor-pointer"
                >
                  Keep Crafting
                </button>
                <button
                  id="toast-goto-basket-btn"
                  onClick={() => {
                    setAddedConfirmItem(null);
                    setActiveTab('basket');
                  }}
                  className="py-3 px-4 rounded-full font-sans text-xs font-bold bg-[#0099FF] text-white hover:bg-blue-600 transition shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-1"
                >
                  <ShoppingCart size={12} />
                  <span>View Basket</span>
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* 4. PERMANENT STICKY WHATSAPP LAUNCHER */}
      <a 
        href={`https://wa.me/9779860000000?text=${encodeURIComponent("Hi Criscrafts Support! I'm visiting your online shop and would love some assistance with a customized handmade order.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 bg-emerald-500/85 backdrop-blur-md border border-emerald-400/30 text-white shadow-xl hover:scale-110 active:scale-95 p-3 sm:p-4 transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer"
        title="Chat with Customer Support"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.248 8.477 3.514 2.266 2.265 3.512 5.274 3.511 8.478-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.115.955 11.482.95c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.463 3.39 1.34 4.877l-.994 3.635 3.74-.973l-.06-.01zm11.002-7.466c-.29-.146-1.727-.853-1.993-.95-.267-.098-.46-.146-.653.146-.193.292-.748.95-.917 1.144-.17.195-.339.219-.63.073-.29-.147-1.228-.452-2.34-1.444-.865-.77-1.45-1.72-1.62-2.013-.17-.29-.018-.448.128-.593.13-.13.29-.34.436-.51.145-.17.194-.292.292-.487.097-.195.048-.366-.024-.51-.073-.146-.653-1.577-.894-2.16-.235-.57-.493-.493-.653-.501-.153-.007-.338-.007-.522-.007-.184 0-.484.07-.738.347-.254.275-.968.948-.968 2.31 0 1.363.991 2.678 1.13 2.872.138.195 1.95 2.977 4.723 4.173.66.284 1.174.453 1.576.58.663.21 1.267.18 1.744.11.53-.08 1.727-.707 1.97-.139c.24-.658.24-1.22.167-1.338-.073-.118-.266-.19-.556-.336z"/>
        </svg>
      </a>

    </div>
  );
}
