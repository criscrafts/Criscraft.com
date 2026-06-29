import React from 'react';
import { MessageCircle, Instagram, Facebook, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'shop' | 'basket') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleQuickNav = (view: 'home' | 'shop' | 'basket', elementId?: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="liquid-glass-footer" className="w-full bg-gradient-to-t from-[#E0F2FE]/40 to-transparent pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Card Body with liquid glass styling */}
        <div className="backdrop-blur-md bg-white/45 border border-white/30 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
          {/* Subtle light reflections */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl -z-10" />

          {/* Grid Layout for Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-left">
            
            {/* Column 1: Brand Mission */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <span className="font-display font-black text-xl text-[#0F172A] tracking-tight">Criscrafts</span>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Handcrafting premium everlasting ribbon bouquets, fluffy chenille wire plushies, and custom character keyrings designed to match your life's most precious stories. Crafted with pure love.
              </p>
              
              {/* Custom pill-shaped social link buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/60 hover:bg-pink-500 hover:text-white transition-all text-xs font-semibold text-slate-700 border border-slate-200/50 shadow-sm"
                >
                  <Instagram size={12} />
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/60 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold text-slate-700 border border-slate-200/50 shadow-sm"
                >
                  <Facebook size={12} />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div className="space-y-4">
              <h4 className="font-display text-xs font-black uppercase tracking-widest text-[#0099FF]">
                Navigation
              </h4>
              <ul className="space-y-2 font-sans text-xs text-slate-600">
                <li>
                  <button 
                    onClick={() => handleQuickNav('shop')}
                    className="hover:text-[#0099FF] transition-colors cursor-pointer text-left"
                  >
                    Home Catalog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickNav('home', 'featured-bento-section')}
                    className="hover:text-[#0099FF] transition-colors cursor-pointer text-left"
                  >
                    Featured Collections
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleQuickNav('home', 'process-guide-section')}
                    className="hover:text-[#0099FF] transition-colors cursor-pointer text-left"
                  >
                    Custom Workbenches
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Important Business Policies */}
            <div className="space-y-4">
              <h4 className="font-display text-xs font-black uppercase tracking-widest text-[#0099FF]">
                Policies & Info
              </h4>
              <ul className="space-y-2 font-sans text-xs text-slate-600">
                <li>
                  <button 
                    onClick={() => handleQuickNav('home', 'process-guide-section')}
                    className="hover:text-[#0099FF] transition-colors cursor-pointer text-left font-medium"
                  >
                    About Criscrafts
                  </button>
                </li>
                <li className="hover:text-[#0099FF] transition-colors text-slate-600 flex items-center gap-1">
                  <span>•</span> <span>Shipping Timelines: 3-5 days</span>
                </li>
                <li className="hover:text-[#0099FF] transition-colors text-slate-600 flex items-center gap-1">
                  <span>•</span> <span>Cancellations: Within 24 hours</span>
                </li>
                <li className="hover:text-[#0099FF] transition-colors text-slate-600 flex items-center gap-1">
                  <span>•</span> <span>100% Quality Guarantee</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Live Shop Operational Status */}
            <div className="space-y-4">
              <h4 className="font-display text-xs font-black uppercase tracking-widest text-[#0099FF]">
                Operational Status
              </h4>
              <div className="bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-inner space-y-3">
                <div className="flex items-center gap-2">
                  {/* Pulsing emerald green dot badge */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-sans text-xs font-bold text-slate-800">
                    Accepting Orders
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-sans text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-[#0099FF]" />
                    <span>Processing: 2-3 days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={11} className="text-[#0099FF]" />
                    <span>WhatsApp Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom border rule line */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-[11px] text-slate-400">
              © {currentYear} Criscrafts. Crafted lovingly in Nepal.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0099FF] text-[10px] font-extrabold uppercase tracking-wider border border-white/45 shadow-sm">
              <MessageCircle size={10} />
              <span>Powered via WhatsApp Checkout Protocol</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
