"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { urlFor } from "@/lib/image";
import { formatPrice } from "@/lib/cart";
import { Button } from "./ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, cartSubtotal, totalItemsCount } = useCart();

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-slate/20 backdrop-blur-sm z-50"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-warm-ivory border-l border-soft-gold/20 shadow-luxury-lg z-50 flex flex-col font-sans"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-soft-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-soft-gold" />
                <span className="font-serif text-lg font-medium text-deep-slate">
                  Your Cart ({totalItemsCount})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-soft-cream/60 text-charcoal hover:text-soft-gold transition-colors duration-300 focus:outline-none"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-pastel-peach flex items-center justify-center text-soft-gold mb-2 shadow-inner">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-deep-slate">Your cart is empty</h3>
                  <p className="text-xs text-dark-gray/60 max-w-[240px]">
                    Explore our premium collections and add hand-finished creations.
                  </p>
                  <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
                    Browse Boutique
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl bg-soft-cream/40 border border-soft-gold/10 hover:border-soft-gold/20 transition-all duration-300 relative group"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-soft-cream flex-shrink-0 border border-soft-gold/5">
                      <Image
                        src={urlFor(item.product.images?.[0])}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-serif text-sm font-medium text-deep-slate truncate pr-6 group-hover:text-soft-gold transition-colors duration-300">
                          {item.product.title}
                        </h4>
                        
                        {/* Customization Badges summary */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.customizations.flowerColor && (
                            <span className="text-[10px] bg-pastel-peach/50 text-charcoal px-2 py-0.5 rounded-md border border-soft-gold/5">
                              {item.customizations.flowerColor}
                            </span>
                          )}
                          {item.customizations.ribbonColor && (
                            <span className="text-[10px] bg-pastel-blue/50 text-charcoal px-2 py-0.5 rounded-md border border-soft-gold/5">
                              Ribbon: {item.customizations.ribbonColor}
                            </span>
                          )}
                          {item.customizations.addGlitter && (
                            <span className="text-[10px] bg-soft-gold/10 text-soft-gold px-2 py-0.5 rounded-md border border-soft-gold/10">
                              + Glitter
                            </span>
                          )}
                          {item.customizations.addSnowPaper && (
                            <span className="text-[10px] bg-muted-rose/10 text-muted-rose px-2 py-0.5 rounded-md border border-muted-rose/10">
                              + Snow Paper
                            </span>
                          )}
                          {item.customizations.customizedText && (
                            <span className="text-[10px] bg-deep-slate/5 text-deep-slate px-2 py-0.5 rounded-md border border-deep-slate/10 max-w-[120px] truncate" title={item.customizations.customizedText}>
                              Label: "{item.customizations.customizedText}"
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Unit Pricing */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-soft-gold/20 rounded-full bg-warm-ivory overflow-hidden px-1.5 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-charcoal/60 hover:text-soft-gold focus:outline-none"
                            aria-label="Decrease Quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2.5 text-deep-slate select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-charcoal/60 hover:text-soft-gold focus:outline-none"
                            aria-label="Increase Quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-deep-slate">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Icon Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-transparent hover:bg-red-50 text-dark-gray/60 hover:text-red-500 transition-colors duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                      aria-label="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer Summary (shows only when cart contains items) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-soft-gold/15 bg-soft-cream/20 flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal font-medium">Subtotal</span>
                  <span className="font-semibold text-deep-slate text-base">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-dark-gray/60 leading-normal">
                  * Shipping fees and customizations are calculated at checkout. Click checkout to review final costs.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/checkout" passHref className="w-full">
                    <Button variant="primary" className="w-full py-3" onClick={onClose}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={onClose} className="py-2.5">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
