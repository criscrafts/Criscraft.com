import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onExplore: () => void;
}

const DECK_ITEMS = [
  {
    id: 'deck-1',
    title: 'Sweet Velvet Bouquet',
    subtitle: 'Pre-made / Fully Custom',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop',
    icon: '🌸',
    rating: '5.0',
    reviews: '56 reviews',
    rotation: 2
  },
  {
    id: 'deck-2',
    title: 'Chibi Anime Charm',
    subtitle: 'Premium Lobster Clasp Keyring',
    image: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=600&auto=format&fit=crop',
    icon: '🧵',
    rating: '4.9',
    reviews: '42 reviews',
    rotation: -4
  },
  {
    id: 'deck-3',
    title: 'Eternal Satin Rose',
    subtitle: 'Satin Ribbon Flower Bouquet',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
    icon: '✨',
    rating: '5.0',
    reviews: '81 reviews',
    rotation: 5
  }
];

interface CardDeckProps {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

function CardDeck({ currentIndex, setCurrentIndex }: CardDeckProps) {
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 70;
    if (info.offset.x > swipeThreshold || info.offset.x < -swipeThreshold) {
      setCurrentIndex((prev) => (prev + 1) % DECK_ITEMS.length);
    }
  };

  return (
    <div className="relative w-72 h-[340px] sm:w-80 sm:h-[380px]">
      {DECK_ITEMS.map((item, index) => {
        // Calculate stacking properties based on positions
        const relativeIndex = (index - currentIndex + DECK_ITEMS.length) % DECK_ITEMS.length;
        const isTop = relativeIndex === 0;

        return (
          <motion.div
            key={item.id}
            style={{
              transformOrigin: 'bottom center',
              touchAction: 'none'
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={isTop ? handleDragEnd : undefined}
            whileDrag={{ scale: 1.03 }}
            animate={{
              scale: isTop ? 1 : 1 - relativeIndex * 0.05,
              y: isTop ? 0 : relativeIndex * 15,
              rotate: isTop ? item.rotation : item.rotation - (relativeIndex * 3),
              zIndex: DECK_ITEMS.length - relativeIndex,
              opacity: relativeIndex === DECK_ITEMS.length - 1 ? 0.3 : 1 - relativeIndex * 0.25,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 25,
            }}
            className={`absolute inset-0 rounded-[2.5rem] p-3 bg-white/75 border border-white/50 backdrop-blur-xl shadow-xl flex flex-col justify-between ${
              isTop ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative select-none">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
              
              {/* Floating active label */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-[1.5rem] border border-white/30 dark:border-slate-800/30 flex items-center justify-between shadow-md pointer-events-none">
                <div className="min-w-0 pr-2">
                  <p className="font-display text-xs font-black text-slate-950 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="font-sans text-[9px] text-[#0099FF] font-black tracking-wide uppercase">
                    {item.subtitle}
                  </p>
                </div>
                <div className="bg-[#0099FF] p-2 rounded-full text-white shrink-0 shadow-md">
                  <Heart size={11} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Floating badge helper */}
            {isTop && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, x: -10 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-lg p-2.5 rounded-[1.25rem] border border-slate-100 shadow-lg flex items-center gap-2 rotate-2 pointer-events-none"
              >
                <div className="h-8 w-8 rounded-xl overflow-hidden bg-sky-100/80 flex items-center justify-center text-base shadow-inner shrink-0">
                  {item.icon}
                </div>
                <div className="text-left min-w-0 pr-2">
                  <p className="font-display text-[9px] font-black text-slate-950 leading-none mb-0.5 truncate">{item.title}</p>
                  <div className="flex items-center gap-1 text-[8px] text-amber-500 font-black">
                    <span>★</span> <span>{item.rating} ({item.reviews})</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Hero({ onExplore }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DECK_ITEMS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div id="hero-section" className="relative overflow-hidden pt-28 md:pt-36 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
      
      {/* Decorative Wavy Floating Blob Background Actions */}
      <div className="absolute top-12 left-10 w-72 h-72 bg-[#0099FF]/10 rounded-full blur-3xl -z-10 animate-pulse duration-10000" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-pink-300/15 rounded-full blur-3xl -z-10 animate-bounce duration-8000" />

      {/* LEFT CONTENT */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
        className="flex-1 space-y-6 text-center md:text-left flex flex-col items-center md:items-start"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/40 text-[#0099FF] text-xs font-semibold shadow-sm">
          <Sparkles size={14} className="animate-spin duration-3000" />
          <span>Handcrafted with Love, Forever Fresh</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          Precious Gifts <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0099FF] to-blue-600">
            Artfully Crafted
          </span> <br />
          to Never Fade
        </h1>

        <p className="font-sans text-xs sm:text-sm md:text-base text-slate-600 max-w-md leading-relaxed">
          At <strong className="text-slate-950 font-semibold">Criscrafts</strong>, we hand-fold gorgeous premium ribbon bouquets, shape puffy chenille wires, and assemble personalized anime-themed keyrings tailored to your exact story.
        </p>

        {/* MOBILE VIEW INTERACTIVE CARD DECK (Placed inline on mobile) */}
        <div className="md:hidden w-full relative h-[380px] flex items-center justify-center select-none py-4">
          <CardDeck currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full justify-center md:justify-start">
          {/* Main Rounded CTA: Explore Handcrafts */}
          <button
            id="home-explore-btn"
            onClick={onExplore}
            className="group relative inline-flex items-center justify-center gap-2 bg-[#0099FF] text-white px-8 py-4 rounded-full font-display font-bold text-base shadow-lg shadow-blue-500/20 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-cyan-400/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Handcrafts <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0099FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>

          <button
            onClick={() => {
              const processEl = document.getElementById('process-guide-section');
              if (processEl) {
                processEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 bg-white/60 hover:bg-white text-slate-700 hover:text-[#0099FF] px-6 py-4 rounded-full font-sans font-semibold text-sm transition-all duration-300 border border-slate-200/50 cursor-pointer"
          >
            How We Customize
          </button>
        </div>

        {/* Feature stats */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100/80 w-full">
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">100%</p>
            <p className="font-sans text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Manual Craft</p>
          </div>
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Rs.250+</p>
            <p className="font-sans text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Starting Price</p>
          </div>
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">4.9 <span className="text-amber-500 text-lg">★</span></p>
            <p className="font-sans text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Customer Rating</p>
          </div>
        </div>
      </motion.div>

      {/* DESKTOP VIEW STACKED CARD DECK */}
      <div className="hidden md:flex flex-1 w-full relative h-[420px] items-center justify-center select-none mt-8 md:mt-0">
        <CardDeck currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      </div>

    </div>
  );
}
