"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Grid, Sparkles, SlidersHorizontal, ArrowUpDown } from "lucide-react";
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
  categories: initialCategories,
  initialCategory = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Derive dynamic categories list to guarantee alignment with actual products
  const categoryList = useMemo(() => {
    const catMap = new Map<string, { slug: string; title: string; count: number }>();

    products.forEach((p) => {
      if (p.category?.slug && p.category?.title) {
        const existing = catMap.get(p.category.slug);
        if (existing) {
          existing.count += 1;
        } else {
          catMap.set(p.category.slug, {
            slug: p.category.slug,
            title: p.category.title,
            count: 1,
          });
        }
      }
    });

    // Merge with any categories passed from props that might have 0 items currently
    initialCategories.forEach((c) => {
      if (c.slug && !catMap.has(c.slug)) {
        catMap.set(c.slug, { slug: c.slug, title: c.title, count: 0 });
      }
    });

    return Array.from(catMap.values());
  }, [products, initialCategories]);

  // Extract all unique tags present across products
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    products.forEach((p) => {
      p.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category?.slug?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesTag =
        !selectedTag ||
        product.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.title?.toLowerCase().includes(query) ||
        product.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesTag && matchesSearch;
    });

    // Sort products
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, selectedTag, searchQuery, sortBy]);

  const hasActiveFilters = Boolean(selectedCategory || selectedTag || searchQuery.trim());

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="w-full font-sans min-h-screen bg-warm-ivory bg-artisan-grid pt-20 pb-16">
      {/* Background glow accent */}
      <div className="absolute top-[15%] left-[-5%] w-[25vw] h-[25vw] rounded-full bg-pastel-blue/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Compact Header Title (No paragraph, optimal spacing for above-the-fold display) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-soft-gold/15">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> CrisCrafts Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate tracking-wide">
              The Artisan Boutique
            </h1>
          </div>

          {/* Quick Item Counter & Sort Control */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-dark-gray/60 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" /> {filteredAndSortedProducts.length} Creation{filteredAndSortedProducts.length !== 1 ? "s" : ""}
            </span>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-1.5 bg-soft-cream/80 border border-soft-gold/20 rounded-full px-3 py-1.5 text-xs text-deep-slate font-medium">
              <ArrowUpDown className="w-3 h-3 text-soft-gold" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none cursor-pointer pr-1"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Toolbar Section */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Dynamic Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none flex-shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === ""
                    ? "bg-deep-slate text-warm-ivory shadow-luxury-sm"
                    : "bg-soft-cream/70 text-charcoal hover:bg-soft-cream border border-soft-gold/15"
                }`}
              >
                <span>All Items</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === "" ? "bg-warm-ivory/20 text-warm-ivory" : "bg-dark-gray/10 text-dark-gray"}`}>
                  {products.length}
                </span>
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none flex-shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? "bg-deep-slate text-warm-ivory shadow-luxury-sm"
                      : "bg-soft-cream/70 text-charcoal hover:bg-soft-cream border border-soft-gold/15"
                  }`}
                >
                  <span>{cat.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat.slug ? "bg-warm-ivory/20 text-warm-ivory" : "bg-dark-gray/10 text-dark-gray"}`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <input
                type="text"
                placeholder="Search creations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full bg-soft-cream/80 border border-soft-gold/20 text-xs text-deep-slate focus:outline-none focus:border-soft-gold focus:ring-1 focus:ring-soft-gold/30 transition-all duration-300 placeholder:text-dark-gray/40"
              />
              <Search className="w-3.5 h-3.5 text-dark-gray/60 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-dark-gray/10 text-dark-gray/60 hover:text-deep-slate focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Optional Tag Filter Ribbon */}
          {availableTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
              <span className="text-[10px] uppercase font-bold text-dark-gray/50 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-soft-gold" /> Filter Tags:
              </span>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 focus:outline-none ${
                    selectedTag === tag
                      ? "bg-soft-gold text-warm-ivory font-semibold"
                      : "bg-soft-cream/50 text-dark-gray hover:bg-soft-cream hover:text-deep-slate border border-soft-gold/10"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Active Filters Summary Pills */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-soft-gold/10 text-xs">
              <span className="text-[10px] uppercase font-bold text-dark-gray/50">Active:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-peach/60 text-deep-slate text-[11px]">
                  Category: {categoryList.find(c => c.slug === selectedCategory)?.title || selectedCategory}
                  <button onClick={() => setSelectedCategory("")} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-blue/60 text-deep-slate text-[11px]">
                  Tag: #{selectedTag}
                  <button onClick={() => setSelectedTag("")} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-soft-gold/20 text-deep-slate text-[11px]">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[11px] text-soft-gold hover:text-deep-slate underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-pastel-peach flex items-center justify-center text-soft-gold mb-1 shadow-inner">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-deep-slate">No matching artisan creations</h3>
            <p className="text-xs text-dark-gray/60 max-w-xs leading-relaxed">
              We couldn't find any creations matching your search or filters. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-soft-gold hover:text-deep-slate border-b border-soft-gold hover:border-deep-slate pb-0.5 transition-all duration-300"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
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
