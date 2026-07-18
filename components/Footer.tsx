import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { GlobalSettings } from "@/types";

export const Footer: React.FC<{ settings: GlobalSettings | null }> = ({ settings }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-soft-cream border-t border-soft-gold/15 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Info */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full border border-soft-gold/20 overflow-hidden shadow-sm">
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
          <p className="text-sm leading-relaxed text-dark-gray/80 max-w-sm">
            Crafting stories, one handmade detail at a time.
            <br />
            ✨ Heart-led, hand-finished, and uniquely yours.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href={settings?.socialInstagram || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-soft-gold/20 hover:border-soft-gold text-charcoal hover:text-soft-gold hover:-translate-y-1 transition-all duration-300"
              aria-label="Instagram Link"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href={settings?.socialFacebook || "https://facebook.com"}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-soft-gold/20 hover:border-soft-gold text-charcoal hover:text-soft-gold hover:-translate-y-1 transition-all duration-300"
              aria-label="Facebook Link"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-deep-slate mb-5">
            Boutique Shop
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href="/shop" className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                All Collections
              </Link>
            </li>
            <li>
              <Link href="/shop?category=ribbon-bouquets" className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                Ribbon Bouquets
              </Link>
            </li>
            <li>
              <Link href="/shop?category=crochet-flowers" className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                Crochet Flowers
              </Link>
            </li>
            <li>
              <Link href="/shop?category=surprise-boxes" className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                Surprise Boxes
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-deep-slate mb-5">
            Artisan Studio
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href="/#our-story" className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                Our Craft Story
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                FAQs & Support
              </Link>
            </li>
            <li>
              <a href={`mailto:${settings?.contactEmail || "hello@criscrafts.com"}`} className="text-dark-gray hover:text-soft-gold transition-colors duration-300">
                {settings?.contactEmail || "hello@criscrafts.com"}
              </a>
            </li>
            {settings?.whatsappNumber ? (
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[+]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-dark-gray hover:text-soft-gold transition-colors duration-300"
                >
                  WhatsApp: Support Desk
                </a>
              </li>
            ) : (
              <li>
                <span className="text-dark-gray">WhatsApp: Support Desk</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-soft-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-dark-gray/60">
          © {currentYear} {settings?.siteName || "CrisCrafts"}. Made with love & craftsmanship. All rights reserved.
        </p>
        <p className="text-xs text-dark-gray/60 flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-muted-rose fill-muted-rose" /> for memorable gifting.
        </p>
      </div>
    </footer>
  );
};
