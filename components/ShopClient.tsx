"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Grid, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Category } from "@/types";
import { ProductCard } from "./ProductCard";

interface ShopClientProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export const ShopClient: React.FC<ShopClientProps> = ({
  products,
  categories,
  initialCategory = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter products based on search query and category slug
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category?.slug.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesSearch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="w-full font-sans min-h-screen bg-warm-ivory bg-artisan-grid pt-28 pb-24">
      {/* Visual background shapes */}
      <div className="absolute top-[20%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-pastel-blue/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Title */}
        <div className="text-left mb-12 flex flex-col gap-3 max-w-xl">
          <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> CrisCrafts Catalog
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-deep-slate leading-tight">
            The Artisan Boutique
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed max-w-md">
            Indulge in hand-stitched crochet plushies, delicate satin ribbon bouquets, and premium surprise hampers made with absolute warmth and love.
          </p>
        </div>

        {/* Filter Toolbar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-soft-gold/15 mb-10">
          {/* Categories tag ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none flex-shrink-0 ${
                selectedCategory === ""
                  ? "bg-deep-slate text-warm-ivory shadow-luxury-sm"
                  : "bg-soft-cream/70 text-charcoal hover:bg-soft-cream border border-soft-gold/10"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none flex-shrink-0 ${
                  selectedCategory === cat.slug
                    ? "bg-deep-slate text-warm-ivory shadow-luxury-sm"
                    : "bg-soft-cream/70 text-charcoal hover:bg-soft-cream border border-soft-gold/10"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search boutique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-full bg-soft-cream/60 border border-soft-gold/15 text-sm text-deep-slate focus:outline-none focus:border-soft-gold focus:ring-1 focus:ring-soft-gold/30 transition-all duration-300"
            />
            <Search className="w-4 h-4 text-dark-gray/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-dark-gray/10 text-dark-gray/60 hover:text-deep-slate focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic products list count */}
        <div className="flex items-center justify-between text-xs text-dark-gray/60 uppercase tracking-widest font-bold mb-8 pl-1">
          <span className="flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5" /> Showing {filteredProducts.length} unique creation{filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pastel-peach flex items-center justify-center text-soft-gold mb-2 shadow-inner animate-pulse">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-deep-slate">No creations match your filter</h3>
            <p className="text-xs text-dark-gray/60 max-w-sm leading-relaxed">
              We couldn't find any handmade items matching your current filters. Try resetting search queries or browse our full collections.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-soft-gold hover:text-deep-slate border-b border-soft-gold hover:border-deep-slate pb-0.5 transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
