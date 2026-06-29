import React from 'react';
import { ShoppingCart, Gift, Heart, HelpCircle, Home, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  currentView: 'home' | 'shop' | 'basket';
  onNavigate: (view: 'home' | 'shop' | 'basket') => void;
}

export default function Navbar({ cartCount, currentView, onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 mx-4 max-w-7xl lg:mx-auto">
      <div 
        id="navbar-container" 
        className="glass-panel px-6 py-3.5 sm:py-4 rounded-full shadow-lg flex items-center justify-center sm:justify-between transition-all duration-300 hover:shadow-xl hover:border-white/40"
      >
        {/* LOGO */}
        <button 
          id="nav-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer group text-slate-900 hover:opacity-90"
        >
          <div className="bg-[#0099FF] text-white p-2 rounded-full shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Gift size={20} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Cris<span className="text-[#0099FF]">crafts</span>
          </span>
        </button>

        {/* NAVIGATION LINKS */}
        <div id="nav-links" className="hidden sm:flex items-center gap-1.5 font-sans font-medium text-sm text-[#0F172A]">
          <button 
            id="nav-btn-home"
            onClick={() => onNavigate('home')}
            className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentView === 'home' 
                ? 'bg-[#0099FF] text-white shadow-md shadow-blue-500/10' 
                : 'hover:bg-white/50 hover:text-[#0099FF]'
            }`}
          >
            Home
          </button>
          <button 
            id="nav-btn-shop"
            onClick={() => onNavigate('shop')}
            className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentView === 'shop' 
                ? 'bg-[#0099FF] text-white shadow-md shadow-blue-500/10' 
                : 'hover:bg-white/50 hover:text-[#0099FF]'
            }`}
          >
            Explore Shop
          </button>
          <button 
            id="nav-btn-process"
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const guideEl = document.getElementById('process-guide-section');
                if (guideEl) {
                  guideEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 150);
            }}
            className="px-5 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-[#0099FF]"
          >
            Our Process
          </button>
        </div>

        {/* BASKET ICON */}
        <button 
          id="nav-btn-basket"
          onClick={() => onNavigate('basket')}
          className={`relative p-3 rounded-full cursor-pointer transition-all duration-300 group hidden sm:inline-flex ${
            currentView === 'basket' 
              ? 'bg-[#0099FF] text-white' 
              : 'bg-white/60 hover:bg-[#E0F2FE] text-[#0F172A] hover:text-[#0099FF] border border-white/40'
          }`}
          aria-label="View basket"
        >
          <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                id="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.25, 1] }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-1.5 -right-1.5 bg-[#FF3B62] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* 5. PERSISTENT MOBILE BOTTOM NAVIGATION (Industry Standard Floating Dock) */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/40 dark:border-slate-800/40 px-6 py-2.5 rounded-full shadow-2xl flex items-center justify-around">
          
          {/* HOME TAB */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 active:scale-90"
          >
            <Home 
              size={20} 
              className={`transition-colors duration-250 ${
                currentView === 'home' 
                  ? 'text-[#0099FF] scale-110' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-[#0099FF]'
              }`} 
            />
            <span 
              className={`text-[10px] font-bold font-sans tracking-wide transition-colors duration-250 ${
                currentView === 'home' 
                  ? 'text-[#0099FF]' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              Home
            </span>
          </button>

          {/* SHOP TAB */}
          <button 
            onClick={() => onNavigate('shop')}
            className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 active:scale-90"
          >
            <ShoppingBag 
              size={20} 
              className={`transition-colors duration-250 ${
                currentView === 'shop' 
                  ? 'text-[#0099FF] scale-110' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-[#0099FF]'
              }`} 
            />
            <span 
              className={`text-[10px] font-bold font-sans tracking-wide transition-colors duration-250 ${
                currentView === 'shop' 
                  ? 'text-[#0099FF]' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              Shop
            </span>
          </button>

          {/* BASKET TAB WITH REAL-TIME BADGE */}
          <button 
            onClick={() => onNavigate('basket')}
            className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 active:scale-90"
          >
            <div className="relative">
              <ShoppingCart 
                size={20} 
                className={`transition-colors duration-250 ${
                  currentView === 'basket' 
                    ? 'text-[#0099FF] scale-110' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-[#0099FF]'
                }`} 
              />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-1.5 -right-2 bg-[#FF3B62] text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span 
              className={`text-[10px] font-bold font-sans tracking-wide transition-colors duration-250 ${
                currentView === 'basket' 
                  ? 'text-[#0099FF]' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              Basket
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
}
