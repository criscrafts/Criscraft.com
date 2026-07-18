"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Eye, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { urlFor } from "@/lib/image";
import { formatPrice } from "@/lib/cart";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const imageUrl = urlFor(product.images?.[0]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      // If the product has options (e.g. ribbon or flower colors), navigate to the product detail page
      window.location.href = `/product/${product.slug}`;
      return;
    }

    // Otherwise, add to cart immediately with empty customizations
    addToCart(product, 1, {});
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative rounded-[24px] bg-warm-ivory border border-soft-gold/15 overflow-hidden shadow-luxury-sm hover:shadow-luxury transition-all duration-500 ease-out group-hover:-translate-y-1">
        {/* Product Image Cover */}
        <div className="relative aspect-square w-full bg-soft-cream overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            loading="lazy"
          />

          {/* Luxury Tags overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.tags?.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant={idx === 0 ? "gold" : "rose"}>
                {tag}
              </Badge>
            ))}
          </div>

          {/* Quick Action Overlay (Desktop only) */}
          <div className="absolute inset-0 bg-deep-slate/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className="p-3 rounded-full bg-warm-ivory text-deep-slate shadow-luxury-sm hover:bg-soft-gold hover:text-warm-ivory transition-colors duration-300 focus:outline-none"
              title={hasVariants ? "Customize & View Options" : "Add to Cart"}
            >
              {isAdded ? (
                <Check className="w-5 h-5" />
              ) : hasVariants ? (
                <Eye className="w-5 h-5" />
              ) : (
                <ShoppingBag className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-5 flex flex-col gap-3 font-sans">
          <div className="flex items-center justify-between gap-1 text-[11px] uppercase tracking-wider font-bold text-dark-gray/60">
            <span>{product.category?.title}</span>
            {product.rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-soft-gold fill-soft-gold" />
                <span className="text-charcoal font-semibold">{product.rating}</span>
              </div>
            )}
          </div>

          <h3 className="font-serif text-lg font-normal text-deep-slate group-hover:text-soft-gold transition-colors duration-300 truncate">
            {product.title}
          </h3>

          <div className="flex items-center justify-between pt-1 border-t border-soft-gold/10">
            <div className="flex items-baseline gap-2">
              {product.discountPrice ? (
                <>
                  <span className="font-medium text-deep-slate text-sm sm:text-base">
                    {formatPrice(product.discountPrice)}
                  </span>
                  <span className="text-xs text-dark-gray/60 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-medium text-deep-slate text-sm sm:text-base">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Quick Add mobile/desktop link */}
            <span
              onClick={handleQuickAdd}
              className="text-xs uppercase tracking-widest font-bold text-soft-gold hover:text-deep-slate transition-colors duration-300 cursor-pointer"
            >
              {hasVariants ? "Customize" : "Quick Add"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
