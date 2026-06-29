import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, X } from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';

interface ShopViewProps {
  onSelectProduct: (product: Product) => void;
  initialCategory?: 'Bouquet' | 'Keyring' | null;
}

export default function ShopView({ onSelectProduct, initialCategory = null }: ShopViewProps) {
  // Filters local states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Bouquet' | 'Keyring'>(initialCategory || 'All');
  const [selectedMaterial, setSelectedMaterial] = useState<'All' | 'Ribbon' | 'Fuzzy Wire' | 'Chocolates'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc'>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Computed filtered list
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesMaterial = selectedMaterial === 'All' || product.material === selectedMaterial;
      const matchesPrice = product.basePrice <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesMaterial && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.basePrice - b.basePrice;
      if (sortBy === 'priceDesc') return b.basePrice - a.basePrice;
      // Popular (rating * popular flag weighting)
      const popA = (a.rating || 0) + (a.popular ? 2 : 0);
      const popB = (b.rating || 0) + (b.popular ? 2 : 0);
      return popB - popA;
    });
  }, [searchQuery, selectedCategory, selectedMaterial, maxPrice, sortBy]);

  // Quick reset helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setMaxPrice(2000);
    setSortBy('popular');
  };

  return (
    <div id="shop-view-container" className="pt-28 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div id="shop-header" className="text-left mb-8 space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight">
          Craft Catalog
        </h1>
        <p className="font-sans text-sm text-slate-500 max-w-xl">
          Search and customize our boutique ribbon/fuzzy wire bouquets or character keyrings. Build your layout live!
        </p>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* ——————— 1. FILTER SIDEBAR (DESKTOP) ——————— */}
        <aside id="desktop-filters" className="hidden md:block col-span-1 glass-panel p-6 rounded-[2rem] space-y-6 sticky top-24 border border-white/30">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-display font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
              <Filter size={14} className="text-[#0099FF]" />
              Filter Craft
            </span>
            <button 
              onClick={handleResetFilters}
              className="text-[11px] font-sans font-bold text-[#0099FF] hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Section: Category Selection */}
          <div className="space-y-2.5">
            <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Type</p>
            <div className="flex flex-col gap-1.5">
              {['All', 'Bouquet', 'Keyring'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`w-full text-left px-4 py-2 rounded-full font-sans text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-[#0099FF] text-white' 
                      : 'bg-white/60 text-slate-700 hover:bg-[#E0F2FE]'
                  }`}
                >
                  {cat === 'All' ? 'All Handcrafts' : cat === 'Bouquet' ? '💐 Bouquets' : '🔑 Keyrings'}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Material Choice */}
          <div className="space-y-2.5">
            <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Crafting Material</p>
            <div className="flex flex-col gap-1.5">
              {['All', 'Ribbon', 'Fuzzy Wire', 'Chocolates'].map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat as any)}
                  className={`w-full text-left px-4 py-2 rounded-full font-sans text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    selectedMaterial === mat 
                      ? 'bg-[#0099FF] text-white' 
                      : 'bg-white/60 text-slate-700 hover:bg-[#E0F2FE]'
                  }`}
                >
                  {mat === 'All' ? 'Any Composition' : mat === 'Ribbon' ? '🧵 Satin Ribbon' : mat === 'Fuzzy Wire' ? '🧸 Chenille / Fuzzy Wire' : '🍫 Sweet Chocolates'}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Price Range Filter */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-extrabold text-slate-400 uppercase tracking-widest">Max Budget</span>
              <span className="font-display font-bold text-slate-800">Rs. {maxPrice}</span>
            </div>
            <input 
              type="range"
              min="200"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0099FF] h-1.5 bg-slate-200/50 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-sans">
              <span>Rs. 200</span>
              <span>Rs. 2,000</span>
            </div>
          </div>
        </aside>

        {/* ——————— 2. PRODUCT GRID SECTION (MD:COL-SPAN-3) ——————— */}
        <div className="md:col-span-3 space-y-6">

          {/* Quick Filters / Search Bar Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                id="shop-search-input"
                type="text"
                placeholder="Search ribbon bouquets, fuzzy bunnies, keyrings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-full border border-slate-200 bg-white/65 backdrop-blur-sm text-sm focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              )}
            </div>

            {/* Sort Dropdown Selector */}
            <div className="flex items-center gap-2 self-stretch sm:self-center">
              <div id="desktop-sort" className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto appearance-none bg-white/65 backdrop-blur-sm border border-slate-200 pl-4 pr-10 py-3 rounded-full font-sans text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0099FF] cursor-pointer"
                >
                  <option value="popular">🔥 Sort: Best Sellers</option>
                  <option value="priceAsc">📈 Sort: Price: Low to High</option>
                  <option value="priceDesc">📉 Sort: Price: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowUpDown size={14} />
                </div>
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                id="mobile-filter-toggle"
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-1.5 bg-white/65 border border-slate-200 px-4 py-3 rounded-full font-sans text-xs font-bold text-slate-700 hover:bg-[#E0F2FE]"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
            </div>

          </div>

          {/* Core Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={onSelectProduct} 
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-md bg-white/45 border border-white/30 rounded-[2.5rem] p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center text-3xl mx-auto shadow-inner animate-pulse">
                ✨
              </div>
              
              <div className="space-y-2">
                <p className="font-display text-lg sm:text-xl font-extrabold text-[#0F172A]">
                  No matching crafts found?
                </p>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Let's make it from scratch! Click below to pitch your unique design concept directly to our creator on WhatsApp.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                <button 
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/60 hover:bg-slate-100 text-slate-700 text-xs font-bold font-sans transition border border-slate-200 cursor-pointer"
                >
                  Clear Filters
                </button>
                <a 
                  href={`https://wa.me/9779860000000?text=${encodeURIComponent("Hi! I was exploring the Criscrafts catalog but couldn't find exactly what I was looking for. I have a unique design concept for a handcrafted item and would love to build it from scratch with you!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0099FF] hover:bg-blue-600 text-white text-xs font-bold font-sans shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>Pitch Concept on WhatsApp 💬</span>
                </a>
              </div>
            </motion.div>
          )}

        </div>

      </div>

      {/* ——————— 3. COLLAPSIBLE DRAWER FILTER (MOBILE CHECKOUT/DRAWER) ——————— */}
      <AnimatePresence>
        {showMobileFilters && (
          <div id="mobile-filter-drawer" className="md:hidden fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Content Drawer - Liquid Glass Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 right-0 bottom-0 w-full max-h-[80vh] backdrop-blur-md bg-white/75 border-t border-white/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto rounded-t-[2.5rem]"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="font-display font-extrabold text-base text-slate-900">
                    Filter Options
                  </span>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-full"
                  >
                    <X size={18} className="text-slate-500" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2.5 text-left">
                  <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Bouquet', 'Keyring'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat as any)}
                        className={`text-center py-2.5 rounded-full font-sans text-xs font-semibold cursor-pointer ${
                          selectedCategory === cat 
                            ? 'bg-[#0099FF] text-white' 
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div className="space-y-2.5 text-left">
                  <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Composition</p>
                  <div className="flex flex-col gap-1.5">
                    {['All', 'Ribbon', 'Fuzzy Wire', 'Chocolates'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterial(mat as any)}
                        className={`w-full text-left px-4 py-2.5 rounded-full font-sans text-xs font-semibold cursor-pointer ${
                          selectedMaterial === mat 
                            ? 'bg-[#0099FF] text-white' 
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {mat === 'All' ? 'Any Component' : mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-extrabold text-slate-400 uppercase tracking-widest">Max Budget</span>
                    <span className="font-display font-bold text-[#0099FF]">Rs. {maxPrice}</span>
                  </div>
                  <input 
                    type="range"
                    min="200"
                    max="2000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#0099FF]"
                  />
                </div>
              </div>

              {/* Apply / Reset Actions in bottom of drawer */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={handleResetFilters}
                  className="py-3 rounded-full font-sans text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="py-3 rounded-full font-sans text-xs font-bold bg-[#0099FF] text-white shadow-md cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Pill-Shaped Filter Button (Mobile only) */}
      <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <button
          id="mobile-floating-filter-pill"
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#0099FF] text-white rounded-full font-sans text-xs font-black shadow-2xl hover:bg-blue-600 transition-all duration-300 scale-100 hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-md"
        >
          <SlidersHorizontal size={14} />
          <span>Filter Crafts</span>
        </button>
      </div>

    </div>
  );
}
