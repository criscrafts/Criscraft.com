import React from 'react';
import { Star, ArrowRight, Heart } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: any;
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-panel p-4 rounded-[2rem] shadow-md hover:shadow-xl border border-white/30 flex flex-col justify-between h-full group"
    >
      <div className="space-y-4">
        {/* Curvy Image Container */}
        <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0099FF] text-white shadow-sm">
              {product.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#0369A1] border border-white/40 shadow-sm font-sans font-medium">
              {product.material}
            </span>
          </div>

          {/* Rating Badge Overlay */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
            <span className="text-amber-500">★</span>
            <span>{product.rating}</span>
          </div>

          {/* Popular Tag */}
          {product.popular && (
            <div className="absolute top-3 right-3 bg-red-500 text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md animate-pulse">
              HOT
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="space-y-2 text-left px-1">
          <h3 className="font-display text-lg font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#0099FF] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-4 mt-3 border-t border-slate-100/60 flex items-center justify-between px-1">
        <div>
          <p className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Starts From</p>
          <p className="font-display text-lg font-black text-[#0F172A]">
            Rs. {product.basePrice}
          </p>
        </div>

        <button
          onClick={() => onClick(product)}
          className="bg-white/90 text-slate-700 hover:bg-[#0099FF] hover:text-white px-5 py-2.5 rounded-full font-sans font-bold text-xs transition-all duration-300 border border-slate-200/50 hover:border-[#0099FF] flex items-center gap-1 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
        >
          View & Craft <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
