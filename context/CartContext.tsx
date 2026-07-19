"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { CartItem, Product, CartCustomizations } from "@/types";
import { calculateItemUnitPrice } from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: CartCustomizations) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to serialize customizations in a deterministic, deep recursive way
const serializeCustomizations = (cust?: CartCustomizations | null): string => {
  if (!cust) return "std";
  const parts: string[] = [];

  if (cust.selectedOptions && typeof cust.selectedOptions === "object") {
    const optsStr = Object.entries(cust.selectedOptions)
      .filter(([_, v]) => Boolean(v))
      .sort(([kA], [kB]) => kA.localeCompare(kB))
      .map(([k, v]) => `${k}:${String(v).trim()}`)
      .join(",");
    if (optsStr) parts.push(`opts(${optsStr})`);
  }

  if (cust.selectedAddons && Array.isArray(cust.selectedAddons)) {
    const addonsStr = [...cust.selectedAddons].filter(Boolean).sort().join(",");
    if (addonsStr) parts.push(`addons(${addonsStr})`);
  }

  if (cust.flowerColor) parts.push(`fc:${cust.flowerColor.trim()}`);
  if (cust.ribbonColor) parts.push(`rc:${cust.ribbonColor.trim()}`);
  if (cust.addGlitter) parts.push(`glitter:1`);
  if (cust.addSnowPaper) parts.push(`snow:1`);
  if (cust.customizedText) parts.push(`txt:${cust.customizedText.trim()}`);
  if (cust.giftNote) parts.push(`note:${cust.giftNote.trim()}`);

  return parts.length > 0 ? parts.sort().join("|") : "std";
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage only after mounting on the client
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("criscrafts_cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (err) {
        console.error("Failed to parse cart items from localStorage", err);
      }
    }

    // Cross-tab cart synchronization listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "criscrafts_cart" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        } catch (err) {
          console.error("Failed to sync cross-tab cart update", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save cart to localStorage whenever items change, but only after mount
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("criscrafts_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (product: Product, quantity: number, customizations: CartCustomizations) => {
    if (!product || !product.slug) return;
    const safeQuantity = Math.min(99, Math.max(1, Math.floor(Number(quantity) || 1)));

    const customizationsKey = serializeCustomizations(customizations);
    const itemId = `${product.slug}-${customizationsKey}`;
    const unitPrice = calculateItemUnitPrice(
      product.price,
      product.discountPrice,
      customizations,
      product
    );

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === itemId);

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const newQuantity = Math.min(99, newItems[existingItemIndex].quantity + safeQuantity);
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          unitPrice, // refresh unit price calculation
        };
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            quantity: safeQuantity,
            customizations,
            unitPrice,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const safeQty = Math.floor(Number(quantity) || 0);
    if (safeQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    const boundedQty = Math.min(99, safeQty);
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: boundedQty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
