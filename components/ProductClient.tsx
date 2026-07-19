"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Check,
  Gift,
  Heart,
  Palette,
  Package,
  Layers,
  MessageSquare,
  Sparkle,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Product, ProductOptionGroup, Addon } from "@/types";
import { useCart } from "@/hooks/useCart";
import { urlFor } from "@/lib/image";
import { formatPrice, calculateItemUnitPrice } from "@/lib/cart";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ProductCard } from "./ProductCard";

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductClient: React.FC<ProductClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addToCart } = useCart();

  // Extract Option Groups and Add-ons from Product (or fallback defaults)
  const optionGroups: ProductOptionGroup[] = useMemo(() => {
    if (product.optionGroups && product.optionGroups.length > 0) {
      return product.optionGroups;
    }
    // Fallback to legacy variants if present
    if (product.variants && product.variants.length > 0) {
      return product.variants.map((v: any) => ({
        name: v.name,
        type: v.name.toLowerCase().includes("color") ? "color" : "radio",
        required: v.required !== false,
        options: v.options.map((o: any) => ({
          name: o.name,
          value: o.name.toLowerCase().replace(/\s+/g, "-"),
          priceImpact: o.priceImpact || 0,
        })),
      }));
    }
    return [];
  }, [product]);

  const addonsList: Addon[] = useMemo(() => {
    if (product.addons && product.addons.length > 0) {
      return product.addons;
    }
    // Fallback default add-ons
    const fallback: Addon[] = [];
    if (product.hasGlitterOption) {
      fallback.push({
        _id: "glitter",
        name: "Spray Sparkly Glitter Dust",
        slug: "glitter",
        price: 50,
        description: "Fine glass-shimmer dust sprayed lightly across petal loops.",
        icon: "sparkles",
      });
    }
    if (product.hasSnowPaperOption) {
      fallback.push({
        _id: "snow",
        name: "Textured White Snow Paper Wrap",
        slug: "snow",
        price: 100,
        description: "Structured, snow-embossed Japanese craft wrapping paper.",
        icon: "snow",
      });
    }
    return fallback;
  }, [product]);

  // Initial State Setup for Selected Options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    optionGroups.forEach((group) => {
      if (group.options && group.options.length > 0) {
        initial[group.name] = group.options[0].name;
      }
    });
    return initial;
  });

  // Selected Add-ons IDs
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Custom Gift Note & Special Catch-All Customization Notes
  const [giftNote, setGiftNote] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  
  // Quantity & Added feedback state
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Gallery Management
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previewImageOverride, setPreviewImageOverride] = useState<string | null>(null);

  // Identify Primary Size Option if available
  const sizeOptionGroup = useMemo(() => {
    return optionGroups.find((g) => g.type === "size" || g.name.toLowerCase().includes("size") || g.name.toLowerCase().includes("count"));
  }, [optionGroups]);

  const selectedSizeValue = useMemo(() => {
    if (!sizeOptionGroup) return null;
    return selectedOptions[sizeOptionGroup.name] || null;
  }, [sizeOptionGroup, selectedOptions]);

  // Active Gallery Images based on Gallery Groups switching philosophy
  const activeGalleryImages = useMemo(() => {
    if (selectedSizeValue && product.galleryGroups && product.galleryGroups.length > 0) {
      const matchedGroup = product.galleryGroups.find(
        (g) =>
          g.optionValue?.toLowerCase() === selectedSizeValue.toLowerCase() ||
          g.title?.toLowerCase().includes(selectedSizeValue.toLowerCase())
      );
      if (matchedGroup && matchedGroup.images && matchedGroup.images.length > 0) {
        return matchedGroup.images.map((img) => urlFor(img));
      }
    }
    // Fallback to default product images
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => urlFor(img));
    }
    return ["/placeholder.png"];
  }, [selectedSizeValue, product]);

  // When size option changes, switch gallery and reset thumbnail index to 0
  useEffect(() => {
    setActiveImageIndex(0);
    setPreviewImageOverride(null);
  }, [selectedSizeValue]);

  // Current main hero image (supports preview image overrides from color/wrapper swatches)
  const currentMainImage = previewImageOverride || activeGalleryImages[activeImageIndex] || activeGalleryImages[0];

  // Dynamic Price Calculation
  const liveUnitPrice = useMemo(() => {
    const customizations = {
      selectedOptions,
      selectedAddons,
      giftNote,
      customizedText: specialNotes,
    };
    return calculateItemUnitPrice(product.price, product.discountPrice, customizations, product);
  }, [product, selectedOptions, selectedAddons, giftNote, specialNotes]);

  // Handle Option Select
  const handleSelectOption = (groupName: string, option: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: option.name,
    }));

    // If option has a preview image, update hero preview
    if (option.previewImage) {
      setPreviewImageOverride(urlFor(option.previewImage));
    } else {
      setPreviewImageOverride(null);
    }
  };

  // Handle Add-on Toggle
  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    const customPayload = {
      selectedOptions,
      selectedAddons,
      giftNote: giftNote.trim(),
      customizedText: specialNotes.trim(), // Special Customization Notes
      // Backward compatibility fields
      flowerColor: selectedOptions["Choose Flower Color"] || selectedOptions["Flower Color"] || "",
      ribbonColor: selectedOptions["Choose Ribbon"] || selectedOptions["Ribbon Style"] || "",
      addGlitter: selectedAddons.some((id) => id.includes("glitter")),
      addSnowPaper: selectedAddons.some((id) => id.includes("snow")),
    };

    addToCart(product, quantity, customPayload);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const hasDiscount = Boolean(
    product.discountPrice &&
      typeof product.discountPrice === "number" &&
      product.discountPrice > 0 &&
      product.discountPrice < (product.price || 0)
  );

  return (
    <div className="w-full font-sans min-h-screen bg-warm-ivory bg-artisan-grid pt-20 sm:pt-22 lg:pt-24 pb-16 text-left">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Navigation */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark-gray/60 hover:text-soft-gold transition-colors duration-300 mb-8 sm:mb-10 pl-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Boutique
        </Link>

        {/* Master Product Configurator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Gallery Panel with Gallery Switching */}
          <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-28">
            <div className="relative aspect-square w-full rounded-[32px] overflow-hidden shadow-luxury border border-soft-gold/15 bg-soft-cream group">
              <Image
                src={currentMainImage}
                alt={product.title || "Product Showcase"}
                fill
                priority
                className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Floating Active Size Badge */}
              {selectedSizeValue && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase font-sans bg-deep-slate text-warm-ivory shadow-luxury-sm">
                    <Sparkle className="w-3 h-3 text-soft-gold animate-pulse" /> {selectedSizeValue} Gallery
                  </span>
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails List */}
            {activeGalleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto touch-pan-x scrollbar-none pb-2 mt-1">
                {activeGalleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setPreviewImageOverride(null);
                    }}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border transition-all duration-300 flex-shrink-0 bg-soft-cream ${
                      activeImageIndex === idx && !previewImageOverride
                        ? "border-soft-gold ring-2 ring-soft-gold/40 scale-95 shadow-md"
                        : "border-soft-gold/15 hover:border-soft-gold/40 hover:scale-95 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.title} gallery view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Craft Guarantee Ribbon */}
            <div className="p-4 rounded-2xl border border-soft-gold/15 bg-soft-cream/40 flex items-center justify-between gap-3 text-xs text-charcoal/80 mt-2 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-soft-gold" />
                <span>100% Hand-finished by master Nepal artisans.</span>
              </div>
              <span className="font-bold text-soft-gold uppercase text-[10px] tracking-wider whitespace-nowrap">Bespoke Quality</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Customization & Configurator Form */}
          <div className="lg:col-span-6 flex flex-col gap-8 text-left">
            
            {/* Header: Title, Category & Live Price Display */}
            <div className="flex flex-col gap-3 pb-6 border-b border-soft-gold/15">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold text-dark-gray/60">
                <span>{product.category?.title || "Handmade Boutique"}</span>
                {product.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-soft-gold fill-soft-gold" />
                    <span className="text-charcoal font-bold">{product.rating}</span>
                    <span className="text-dark-gray/50 font-normal">({product.reviewsCount || 12} reviews)</span>
                  </div>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate leading-tight tracking-wide">
                {product.title}
              </h1>

              {/* Dynamic Live Price Display */}
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-serif text-3xl font-medium text-deep-slate">
                  {formatPrice(liveUnitPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-dark-gray/60 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                <Badge variant="rose" className="ml-2">Custom Hand-Crafted</Badge>
              </div>

              <p className="font-sans text-sm leading-relaxed text-charcoal/80 mt-2">
                {product.description}
              </p>
            </div>

            {/* REORDERED CUSTOMIZATION FORM SECTION */}
            <div className="flex flex-col gap-8">
              
              {/* 1. CHOOSE BOUQUET SIZE / PRIMARY SIZE OPTION */}
              {optionGroups.map((group) => {
                if (group.type !== "size" && !group.name.toLowerCase().includes("size") && !group.name.toLowerCase().includes("count")) {
                  return null;
                }

                return (
                  <div key={group.name} className="flex flex-col gap-3 font-sans">
                    <label className="text-xs uppercase tracking-widest font-bold text-deep-slate flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-soft-gold" /> {group.name}
                      </span>
                      <span className="text-soft-gold font-normal text-[11px]">
                        Selected: <strong>{selectedOptions[group.name]}</strong>
                      </span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {group.options.map((opt) => {
                        const isSelected = selectedOptions[group.name] === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => handleSelectOption(group.name, opt)}
                            className={`p-3.5 rounded-2xl text-xs font-medium transition-all duration-300 text-left flex flex-col gap-1 border focus:outline-none ${
                              isSelected
                                ? "bg-deep-slate border-deep-slate text-warm-ivory shadow-luxury-sm ring-1 ring-deep-slate"
                                : "bg-soft-cream/40 border-soft-gold/15 text-charcoal hover:border-soft-gold/40 hover:bg-soft-cream/80"
                            }`}
                          >
                            <span className="font-semibold text-sm">{opt.name}</span>
                            {opt.priceImpact ? (
                              <span className={`text-[10px] ${isSelected ? "text-soft-gold" : "text-dark-gray/60"}`}>
                                +{formatPrice(opt.priceImpact)}
                              </span>
                            ) : (
                              <span className={`text-[10px] ${isSelected ? "text-warm-ivory/60" : "text-dark-gray/50"}`}>
                                Base Tier
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* 2. CHOOSE FLOWER / PETAL COLOR (CIRCULAR COLOR SWATCHES) */}
              {optionGroups.map((group) => {
                if (group.type !== "color" && !group.name.toLowerCase().includes("color") && !group.name.toLowerCase().includes("petal")) {
                  return null;
                }

                return (
                  <div key={group.name} className="flex flex-col gap-3 font-sans">
                    <label className="text-xs uppercase tracking-widest font-bold text-deep-slate flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-soft-gold" /> {group.name}
                      </span>
                      <span className="text-soft-gold font-normal text-[11px]">
                        Selected: <strong>{selectedOptions[group.name]}</strong>
                      </span>
                    </label>

                    {/* Circular Color Swatch Grid */}
                    <div className="flex flex-wrap gap-3">
                      {group.options.map((opt) => {
                        const isSelected = selectedOptions[group.name] === opt.name;
                        const hex = opt.hexColor || "#3B79C6";

                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => handleSelectOption(group.name, opt)}
                            className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 border focus:outline-none ${
                              isSelected
                                ? "border-soft-gold bg-soft-cream/80 shadow-luxury-sm ring-1 ring-soft-gold/40"
                                : "border-soft-gold/15 bg-warm-ivory hover:border-soft-gold/40"
                            }`}
                          >
                            {/* Circular Visual Swatch */}
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110"
                              style={{ backgroundColor: hex }}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white drop-shadow-md" />}
                            </span>

                            <span className="text-deep-slate font-semibold">{opt.name}</span>
                            {opt.priceImpact ? (
                              <span className="text-[10px] text-soft-gold font-semibold">
                                (+{formatPrice(opt.priceImpact)})
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* 3. CHOOSE WRAPPER / PACKAGING (TEXTURED SWATCHES) */}
              {optionGroups.map((group) => {
                if (
                  group.type !== "wrapper" &&
                  !group.name.toLowerCase().includes("wrapper") &&
                  !group.name.toLowerCase().includes("paper") &&
                  !group.name.toLowerCase().includes("ribbon")
                ) {
                  return null;
                }

                return (
                  <div key={group.name} className="flex flex-col gap-3 font-sans">
                    <label className="text-xs uppercase tracking-widest font-bold text-deep-slate flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-soft-gold" /> {group.name}
                      </span>
                      <span className="text-soft-gold font-normal text-[11px]">
                        Selected: <strong>{selectedOptions[group.name]}</strong>
                      </span>
                    </label>

                    {/* Textured Circular Swatches */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {group.options.map((opt) => {
                        const isSelected = selectedOptions[group.name] === opt.name;
                        const hex = opt.hexColor || "#F9F6F0";

                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => handleSelectOption(group.name, opt)}
                            className={`p-3 rounded-2xl text-xs font-medium transition-all duration-300 flex items-center gap-3 border text-left focus:outline-none ${
                              isSelected
                                ? "bg-soft-cream border-soft-gold ring-1 ring-soft-gold/30 shadow-luxury-sm"
                                : "bg-warm-ivory border-soft-gold/15 hover:border-soft-gold/40"
                            }`}
                          >
                            {/* Textured Swatch Circle */}
                            <div
                              className="w-7 h-7 rounded-full border border-black/10 flex-shrink-0 shadow-inner flex items-center justify-center"
                              style={{ backgroundColor: hex }}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-deep-slate" />}
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-deep-slate truncate">{opt.name}</span>
                              <span className="text-[10px] text-dark-gray/60">
                                {opt.priceImpact ? `+${formatPrice(opt.priceImpact)}` : "Standard Included"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* ANY OTHER GENERIC OPTION GROUPS (Pills / Radio / Select) */}
              {optionGroups.map((group) => {
                const nameLower = group.name.toLowerCase();
                if (
                  group.type === "size" ||
                  group.type === "color" ||
                  group.type === "wrapper" ||
                  nameLower.includes("size") ||
                  nameLower.includes("color") ||
                  nameLower.includes("wrapper") ||
                  nameLower.includes("ribbon")
                ) {
                  return null;
                }

                return (
                  <div key={group.name} className="flex flex-col gap-3 font-sans">
                    <label className="text-xs uppercase tracking-widest font-bold text-deep-slate">
                      {group.name}
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const isSelected = selectedOptions[group.name] === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => handleSelectOption(group.name, opt)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border focus:outline-none ${
                              isSelected
                                ? "bg-deep-slate border-deep-slate text-warm-ivory shadow-luxury-sm"
                                : "bg-transparent border-soft-gold/20 text-charcoal hover:border-soft-gold/50"
                            }`}
                          >
                            {opt.name} {opt.priceImpact ? `(+${formatPrice(opt.priceImpact)})` : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* 4. CHOOSE OPTIONAL ADD-ONS (REUSABLE ADD-ON TOGGLE CARDS) */}
              {addonsList.length > 0 && (
                <div className="flex flex-col gap-3 font-sans pt-2 border-t border-soft-gold/15">
                  <label className="text-xs uppercase tracking-widest font-bold text-deep-slate flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-soft-gold" /> Optional Add-on Embellishments
                    </span>
                    <span className="text-[10px] text-dark-gray/60 font-normal">Select any to enhance</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addonsList.map((addon) => {
                      const isChecked = selectedAddons.includes(addon._id);
                      return (
                        <div
                          key={addon._id}
                          onClick={() => handleToggleAddon(addon._id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 select-none ${
                            isChecked
                              ? "bg-soft-cream border-soft-gold ring-1 ring-soft-gold/30 shadow-luxury-sm"
                              : "bg-warm-ivory border-soft-gold/15 hover:border-soft-gold/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by parent container click
                            className="mt-0.5 w-4 h-4 rounded text-soft-gold focus:ring-soft-gold/30 border-soft-gold/20 accent-soft-gold"
                          />

                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-xs text-deep-slate truncate">
                                {addon.name}
                              </span>
                              <span className="text-[11px] font-bold text-soft-gold whitespace-nowrap">
                                +{formatPrice(addon.price)}
                              </span>
                            </div>
                            {addon.description && (
                              <p className="text-[11px] text-dark-gray/70 leading-relaxed line-clamp-2">
                                {addon.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. QUANTITY SELECTOR */}
              <div className="flex flex-col gap-2 font-sans pt-2 border-t border-soft-gold/15">
                <label className="text-xs uppercase tracking-widest font-bold text-deep-slate">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-soft-gold/20 rounded-full bg-soft-cream/40 overflow-hidden px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-charcoal/60 hover:text-soft-gold focus:outline-none"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold px-4 text-deep-slate select-none min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-charcoal/60 hover:text-soft-gold focus:outline-none"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-dark-gray/60">
                    Total: <strong className="text-deep-slate">{formatPrice(liveUnitPrice * quantity)}</strong>
                  </span>
                </div>
              </div>

              {/* 6. GIFT CARD MESSAGE */}
              {product.hasGiftNoteOption !== false && (
                <div className="flex flex-col gap-2.5 font-sans pt-2 border-t border-soft-gold/15">
                  <label className="text-xs uppercase tracking-widest font-bold text-deep-slate flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-soft-gold" /> Write a Gift Card Note (Optional)
                  </label>
                  <textarea
                    placeholder="Type your personal message card content here..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    rows={2}
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-xl border border-soft-gold/25 focus:border-soft-gold bg-warm-ivory text-xs text-deep-slate outline-none placeholder:text-dark-gray/40 resize-none"
                  />
                </div>
              )}

              {/* 7. SPECIAL CUSTOMIZATION NOTES (MUST ALWAYS BE THE LAST CUSTOMIZATION OPTION) */}
              <div className="flex flex-col gap-2.5 font-sans pt-2 border-t border-soft-gold/15">
                <label className="text-xs uppercase tracking-widest font-bold text-deep-slate flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-soft-gold" /> Special Customization Notes
                  </span>
                  <span className="text-[10px] text-dark-gray/50 font-normal">Catch-all custom request</span>
                </label>
                <textarea
                  placeholder="e.g., 'Use lavender ribbon instead', 'Mix white and pink roses', 'Add graduation badge'"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 rounded-xl border border-soft-gold/25 focus:border-soft-gold bg-warm-ivory text-xs text-deep-slate outline-none placeholder:text-dark-gray/40 resize-none"
                />
                <p className="text-[11px] text-dark-gray/60 leading-normal">
                  * Specify any custom requests not covered by options above. Our team will verify this on WhatsApp!
                </p>
              </div>

              {/* 8. ADD TO CART & DYNAMIC PRICE SUMMARY CTA */}
              <div className="pt-4 border-t border-soft-gold/15">
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  className="w-full py-4 text-base font-semibold shadow-luxury hover:shadow-luxury-lg"
                  leftIcon={isAdded ? <Check className="w-5 h-5 text-warm-ivory" /> : <ShoppingBag className="w-5 h-5" />}
                >
                  {isAdded ? "Added to Cart!" : `Add to Cart • ${formatPrice(liveUnitPrice * quantity)}`}
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* Customer Collector Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-soft-gold/15">
            <div className="text-left max-w-xl mb-12">
              <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">Verified Collectors</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-deep-slate mt-2">
                Collector Reviews
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl bg-soft-cream/30 border border-soft-gold/10 text-left font-sans"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h4 className="text-sm font-semibold text-deep-slate">{review.author}</h4>
                    <span className="text-xs text-dark-gray/50">{review.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < review.rating ? "text-soft-gold fill-soft-gold" : "text-dark-gray/25"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm text-charcoal/85 italic leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Handcrafted Creations */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-soft-gold/15">
            <div className="text-left mb-12 flex flex-col gap-2">
              <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">Complete the bouquet</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-deep-slate">
                Related Handcrafted Creations
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.slice(0, 3).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Minus / Plus SVGs
const Minus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
