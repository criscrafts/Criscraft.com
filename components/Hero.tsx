"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Product, HeroData } from "@/types";
import { SwipeableCards } from "./SwipeableCards";

export const Hero: React.FC<{ products: Product[]; heroData: HeroData | null }> = ({ products, heroData }) => {
  return (
    <section className="relative min-h-0 lg:min-h-[80vh] flex items-center justify-center pt-20 sm:pt-22 lg:pt-24 pb-12 sm:pb-14 lg:pb-16 overflow-hidden bg-mesh-gradient bg-artisan-grid">
      {/* Animated Organic Background Shapes */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 25, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-pastel-peach/25 blur-[90px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-pastel-blue/25 blur-[110px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 15, -15, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[40%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-soft-pink/15 blur-[70px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10 relative">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start text-left gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-soft-gold/15 bg-soft-cream/60 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-soft-gold animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
              Unique Handcrafted Treasures
            </span>
          </motion.div>

          <div className="flex flex-col gap-4 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-deep-slate tracking-tight"
            >
              {heroData?.title ? (
                <span dangerouslySetInnerHTML={{ __html: heroData.title }} />
              ) : (
                <>
                  Crafting stories, <br />
                  one <span className="font-serif italic text-soft-gold">handmade</span> detail <br className="hidden sm:inline" />
                  at a time.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-sm sm:text-base leading-relaxed text-charcoal/80 max-w-lg mt-2"
            >
              {heroData?.subtitle || "✨ Heart-led, hand-finished, and uniquely yours. Step into a world of premium artisan gift-giving where every stitch, ribbon, and fold is woven with absolute love."}
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <Link href={heroData?.primaryButtonLink || "/shop"} passHref className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {heroData?.primaryButtonText || "Explore Collection"}
              </Button>
            </Link>
            <Link href={heroData?.secondaryButtonLink || "/#our-story"} passHref className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {heroData?.secondaryButtonText || "Our Story"}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-soft-gold/10 w-full"
          >
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-medium text-deep-slate">100%</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-gray/60">
                Handcrafted
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-medium text-deep-slate">Premium</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-gray/60">
                Materials
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-lg font-medium text-deep-slate">Bespoke</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-gray/60">
                Gift Options
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-6 flex items-center justify-center relative mt-8 lg:mt-0 w-full">
          {heroData?.mainImage ? (
            <div className="relative aspect-[4/5] w-[90%] sm:w-[80%] rounded-[32px] overflow-hidden shadow-luxury border border-soft-gold/15">
              <Image
                src={heroData.mainImage}
                alt={heroData.title || "Showcase Image"}
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 40vw"
                priority
              />
            </div>
          ) : (
            <SwipeableCards products={products} />
          )}

          {/* Floating Glassmorphic Labels */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 left-2 sm:top-12 sm:-left-8 glassmorphism px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-luxury flex items-center gap-3 z-20 border border-soft-gold/20"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pastel-peach flex items-center justify-center text-soft-gold shadow-sm">
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-dark-gray/60">Made with</p>
              <p className="font-serif text-xs font-semibold text-deep-slate">Pure Love</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-2 right-2 sm:bottom-12 sm:-right-6 glassmorphism px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-luxury flex items-center gap-3 z-20 border border-soft-gold/20"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pastel-blue flex items-center justify-center text-sky-blue shadow-sm">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-dark-gray/60">Finished By</p>
              <p className="font-serif text-xs font-semibold text-deep-slate">Master Artisans</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
