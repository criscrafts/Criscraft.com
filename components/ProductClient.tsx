"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Sparkles, ShoppingBag, ArrowLeft, Heart, Check, Gift } from "lucide-react";
import { Product } from "@/types";
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

  // Active States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Customization States
  const [flowerColor, setFlowerColor] = useState<string>(
    product.variants?.find((v) => v.name.toLowerCase().includes("color") || v.name.toLowerCase().includes("petal"))?.options[0]?.name || ""
  );
  const [ribbonColor, setRibbonColor] = useState<string>(
    product.variants?.find((v) => v.name.toLowerCase().includes("ribbon"))?.options[0]?.name || ""
  );
  const [addGlitter, setAddGlitter] = useState(false);
  const [addSnowPaper, setAddSnowPaper] = useState(false);
  const [customizedText, setCustomizedText] = useState("");
  const [giftNote, setGiftNote] = useState("");

  const currentImage = urlFor(product.images?.[activeImageIndex]);

  // Combine options into standard customizations package
  const customizations = useMemo(() => {
    const cust: any = {};
    if (flowerColor) cust.flowerColor = flowerColor;
    if (ribbonColor) cust.ribbonColor = ribbonColor;
    if (addGlitter) cust.addGlitter = addGlitter;
    if (addSnowPaper) cust.addSnowPaper = addSnowPaper;
    if (customizedText.trim()) cust.customizedText = customizedText.trim();
    if (giftNote.trim()) cust.giftNote = giftNote.trim();
    return cust;
  }, [flowerColor, ribbonColor, addGlitter, addSnowPaper, customizedText, giftNote]);

  // Calculate live dynamic price
  const livePrice = useMemo(() => {
    return calculateItemUnitPrice(
      product.price,
      product.discountPrice,
      customizations,
      product
    );
  }, [product, customizations]);

  const handleAddToCart = () => {
    addToCart(product, quantity, customizations);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="w-full font-sans min-h-screen bg-warm-ivory bg-artisan-grid pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark-gray/60 hover:text-soft-gold transition-colors duration-300 mb-10 pl-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Boutique
        </Link>

        {/* Core Product Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Gallery Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4 sticky top-28">
            <div className="relative aspect-square w-full rounded-[32px] overflow-hidden shadow-luxury border border-soft-gold/15 bg-soft-cream">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                className="object-cover transition-all duration-500 ease-out"
                sizes="(max-w-768px) 100vw, 50vw"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 mt-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border transition-all duration-300 flex-shrink-0 bg-soft-cream ${
                      activeImageIndex === idx
                        ? "border-soft-gold ring-1 ring-soft-gold/30 scale-95 shadow-md"
                        : "border-soft-gold/15 hover:border-soft-gold/40 hover:scale-95"
                    }`}
                  >
                    <Image
                      src={urlFor(img)}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Customization & Purchase Forms */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            {/* Brand Category & Rating */}
            <div className="flex items-center justify-between gap-1 text-[11px] uppercase tracking-widest font-bold text-dark-gray/60">
              <span>{product.category?.title}</span>
              {product.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-soft-gold fill-soft-gold" />
                  <span className="text-charcoal font-bold">{product.rating}</span>
                  <span className="text-dark-gray/50 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-3 pb-6 border-b border-soft-gold/15">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate leading-tight tracking-wide">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-3 mt-1.5">
                {product.discountPrice ? (
                  <>
                    <span className="font-serif text-2xl font-medium text-deep-slate">
                      {formatPrice(livePrice)}
                    </span>
                    <span className="text-sm text-dark-gray/60 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-2xl font-medium text-deep-slate">
                    {formatPrice(livePrice)}
                  </span>
                )}
                <Badge variant="rose" className="ml-2">Handmade</Badge>
              </div>

              <p className="font-sans text-sm leading-relaxed text-charcoal/80 mt-2">
                {product.description}
              </p>
            </div>

            {/* Customization Details form */}
            <div className="flex flex-col gap-6 py-2 border-b border-soft-gold/15">
              <h3 className="font-serif text-lg font-normal text-deep-slate">Customize creation</h3>
              
              {/* Dynamic variant dropdowns */}
              {product.variants?.map((v, vIdx) => {
                const isColor = v.name.toLowerCase().includes("color") || v.name.toLowerCase().includes("petal");
                const isRibbon = v.name.toLowerCase().includes("ribbon");

                return (
                  <div key={vIdx} className="flex flex-col gap-2.5 font-sans">
                    <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/80">
                      {v.name} {v.required && <span className="text-soft-gold">*</span>}
                    </label>

                    {isColor && (
                      <div className="flex flex-wrap gap-2.5">
                        {v.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setFlowerColor(opt.name)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 focus:outline-none border ${
                              flowerColor === opt.name
                                ? "bg-deep-slate border-deep-slate text-warm-ivory shadow-luxury-sm"
                                : "bg-transparent border-soft-gold/20 text-charcoal hover:border-soft-gold/50"
                            }`}
                          >
                            {opt.name} {opt.priceImpact ? `(+${formatPrice(opt.priceImpact)})` : ""}
                          </button>
                        ))}
                      </div>
                    )}

                    {isRibbon && (
                      <div className="flex flex-wrap gap-2.5">
                        {v.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setRibbonColor(opt.name)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 focus:outline-none border ${
                              ribbonColor === opt.name
                                ? "bg-deep-slate border-deep-slate text-warm-ivory shadow-luxury-sm"
                                : "bg-transparent border-soft-gold/20 text-charcoal hover:border-soft-gold/50"
                            }`}
                          >
                            {opt.name} {opt.priceImpact ? `(+${formatPrice(opt.priceImpact)})` : ""}
                          </button>
                        ))}
                      </div>
                    )}

                    {!isColor && !isRibbon && (
                      <select
                        value={isRibbon ? ribbonColor : flowerColor}
                        onChange={(e) => isRibbon ? setRibbonColor(e.target.value) : setFlowerColor(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-soft-gold/25 focus:border-soft-gold focus:ring-1 focus:ring-soft-gold/30 bg-warm-ivory text-sm text-deep-slate outline-none"
                      >
                        {v.options.map((opt, oIdx) => (
                          <option key={oIdx} value={opt.name}>
                            {opt.name} {opt.priceImpact ? `(+${formatPrice(opt.priceImpact)})` : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}

              {/* Text label / custom embroidery */}
              <div className="flex flex-col gap-2.5 font-sans">
                <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/80">
                  Custom Card / Tag text Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 'Happy Anniversary Mom' or 'Class of 2026'"
                  value={customizedText}
                  onChange={(e) => setCustomizedText(e.target.value)}
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-xl border border-soft-gold/25 focus:border-soft-gold bg-warm-ivory text-sm text-deep-slate outline-none placeholder:text-dark-gray/30"
                />
              </div>

              {/* Toggles (Glitter & Snow paper) */}
              {(product.hasGlitterOption || product.hasSnowPaperOption) && (
                <div className="flex flex-col gap-3 mt-1.5 font-sans">
                  <span className="text-xs uppercase tracking-widest font-semibold text-charcoal/80">Add-on embellishments</span>
                  
                  {product.hasGlitterOption && (
                    <label className="flex items-center gap-3 cursor-pointer group text-sm select-none text-charcoal/90">
                      <input
                        type="checkbox"
                        checked={addGlitter}
                        onChange={(e) => setAddGlitter(e.target.checked)}
                        className="w-4 h-4 rounded text-soft-gold focus:ring-soft-gold/30 border-soft-gold/20 accent-soft-gold"
                      />
                      <span>Spray Sparkly Glitter Dust (+{formatPrice(50)})</span>
                    </label>
                  )}

                  {product.hasSnowPaperOption && (
                    <label className="flex items-center gap-3 cursor-pointer group text-sm select-none text-charcoal/90">
                      <input
                        type="checkbox"
                        checked={addSnowPaper}
                        onChange={(e) => setAddSnowPaper(e.target.checked)}
                        className="w-4 h-4 rounded text-soft-gold focus:ring-soft-gold/30 border-soft-gold/20 accent-soft-gold"
                      />
                      <span>Wrap with Textured White Snow Paper (+{formatPrice(100)})</span>
                    </label>
                  )}
                </div>
              )}

              {/* Gift message card */}
              {product.hasGiftNoteOption && (
                <div className="flex flex-col gap-2.5 font-sans">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/80 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-soft-gold" /> Write a Gift Card Note (Optional)
                  </label>
                  <textarea
                    placeholder="Type your personal message card content here..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-xl border border-soft-gold/25 focus:border-soft-gold bg-warm-ivory text-sm text-deep-slate outline-none placeholder:text-dark-gray/30 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Quantity Selector & Purchase Actions */}
            <div className="flex gap-4 items-stretch mt-2 font-sans">
              <div className="flex items-center border border-soft-gold/20 rounded-full bg-soft-cream/40 overflow-hidden px-3 py-2">
                <button
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-charcoal/60 hover:text-soft-gold focus:outline-none"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleAddToCart}
                className="flex-1 py-3"
                leftIcon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              >
                {isAdded ? "Added to Cart" : `Add to Cart • ${formatPrice(livePrice * quantity)}`}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="mt-24 pt-16 border-t border-soft-gold/15">
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

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-soft-gold/15">
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

// Small helpers for minus/plus inside component
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
