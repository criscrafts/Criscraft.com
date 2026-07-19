"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Gift, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "./CartDrawer";
import { GlobalSettings } from "@/types";

export const Navbar: React.FC<{ settings: GlobalSettings | null }> = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  const pathname = usePathname();
  const { totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "Our Story", href: "/#our-story" },
    { name: "FAQs", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "glassmorphism shadow-luxury-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {settings?.announcementText && (
          <div className="bg-soft-gold text-warm-ivory text-center py-2 px-4 text-[10px] font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>{settings.announcementText}</span>
          </div>
        )}
        <div className={`max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "py-3.5" : "py-5"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-full border border-soft-gold/20 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src={settings?.logo || "/favicon.png"}
                alt={`${settings?.siteName || "CrisCrafts"} Logo`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            {settings?.siteName ? (
              <span className="font-serif text-2xl font-semibold tracking-wide text-deep-slate">
                {settings.siteName.toLowerCase().startsWith("criscrafts") ? (
                  <>
                    Cris<span className="text-soft-gold font-normal">crafts</span>
                  </>
                ) : (
                  settings.siteName
                )}
              </span>
            ) : (
              <span className="font-serif text-2xl font-semibold tracking-wide text-deep-slate">
                Cris<span className="text-soft-gold font-normal">crafts</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm tracking-widest uppercase font-semibold transition-colors duration-300 py-1 ${
                    isActive ? "text-soft-gold" : "text-charcoal/80 hover:text-soft-gold"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-soft-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-soft-cream/60 transition-colors duration-300 focus:outline-none"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-deep-slate" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-soft-gold text-warm-ivory text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-luxury-sm"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-full hover:bg-soft-cream/60 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-gold"
              aria-label={isMobileMenuOpen ? "Close Mobile Navigation Menu" : "Open Mobile Navigation Menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-deep-slate" /> : <Menu className="w-6 h-6 text-deep-slate" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full left-0 right-0 z-30 md:hidden bg-warm-ivory border-b border-soft-gold/15 py-8 px-6 shadow-luxury-lg"
            >
              <div className="flex flex-col gap-6 align-center text-center">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-base tracking-widest uppercase font-semibold transition-colors duration-300 ${
                        isActive ? "text-soft-gold" : "text-charcoal hover:text-soft-gold"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Slide-over Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
    </>
  );
};
