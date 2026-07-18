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

// Helper to serialize customizations in a deterministic, browser-safe way
const serializeCustomizations = (cust: CartCustomizations): string => {
  return Object.entries(cust)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, val]) => `${key}:${val}`)
    .join("|");
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
        setItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart items from localStorage", err);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change, but only after mount
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("criscrafts_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (product: Product, quantity: number, customizations: CartCustomizations) => {
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
        // Update quantity of existing item with matching customization
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new unique item configuration
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            quantity,
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
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
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
