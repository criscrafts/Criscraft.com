"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Product } from "@/types";
import { urlFor } from "@/lib/image";

interface SwipeableCardsProps {
  products: Product[];
}

export const SwipeableCards: React.FC<SwipeableCardsProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (!products || products.length === 0) return null;

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < Math.min(products.length, 3); i++) {
      const index = (currentIndex + i) % products.length;
      cards.push({ product: products[index], relativeDepth: i });
    }
    return cards.reverse();
  };

  return (
    <div className="relative w-full max-w-[380px] h-[520px] flex items-center justify-center select-none">
      <AnimatePresence mode="popLayout">
        {getVisibleCards().map(({ product, relativeDepth }) => {
          return (
            <SwipeCard
              key={product._id}
              product={product}
              depth={relativeDepth}
              onSwipe={handleSwipe}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

interface SwipeCardProps {
  product: Product;
  depth: number;
  onSwipe: (direction: "left" | "right") => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ product, depth, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0.5, 1, 1, 1, 0.5]);

  const isTop = depth === 0;

  const handleDragEnd = (_: any, info: any) => {
    if (!isTop) return;

    const threshold = 120;
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    }
  };

  const scale = 1 - depth * 0.05;
  const translateY = depth * 14;
  const zIndex = 10 - depth;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1 - depth * 0.15,
        scale,
        y: translateY,
        zIndex,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={isTop ? { scale: 1.02, cursor: "grabbing" } : {}}
      animate={{
        y: translateY,
        scale,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className="absolute w-full h-[480px] rounded-3xl overflow-hidden glassmorphism flex flex-col p-4 shadow-luxury-lg border border-soft-gold/25 bg-white/95 cursor-grab"
    >
      {/* Product Image Cover (380px height for dominance) */}
      <div className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-soft-cream border border-soft-gold/10">
        <Image
          src={urlFor(product.images?.[0])}
          alt={product.title}
          fill
          className="object-cover pointer-events-none"
          sizes="380px"
          priority={depth === 0}
        />

        {/* Small floating tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase font-sans bg-soft-gold text-warm-ivory shadow-sm">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Swipe to Browse
          </span>
        </div>
      </div>

      {/* Card Metadata info (Minimal: Only Name and action link) */}
      <div className="flex items-center justify-between mt-4 px-1 font-sans">
        <h3 className="font-serif text-lg font-normal text-deep-slate truncate max-w-[70%]">
          {product.title}
        </h3>
        
        <Link
          href={`/product/${product.slug}`}
          className="text-[10px] uppercase tracking-widest font-bold text-soft-gold hover:text-deep-slate transition-colors duration-300 flex-shrink-0"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};
