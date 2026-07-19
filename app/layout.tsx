import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrisCrafts | Premium Luxury Artisan Gift Boutique",
  description:
    "Crafting stories, one handmade detail at a time. Explore our luxury collection of custom ribbon bouquets, crochet flowers, plushies, and custom surprise boxes made with love.",
  keywords: [
    "Ribbon Bouquet Nepal",
    "Handmade Gifts Kathmandu",
    "Custom Crochet Bouquet",
    "Fuzzy Wire Flowers",
    "Artisan Gift Shop",
    "CrisCrafts",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "CrisCrafts | Premium Luxury Artisan Gift Boutique",
    description:
      "Heart-led, hand-finished, and uniquely yours. Discover premium, eternal handmade gifts.",
    url: "https://criscrafts.com",
    siteName: "CrisCrafts",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "CrisCrafts Artisan Boutique",
    url: "https://criscrafts.com",
    description:
      "Crafting stories, one handmade detail at a time. Premium custom ribbon bouquets, crochet plushies, and luxury gift hampers.",
    priceRange: "Rs. 450 - Rs. 8500",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${poppins.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-warm-ivory text-deep-slate font-sans min-h-screen antialiased flex flex-col focus-visible:outline-none">
        {children}
      </body>
    </html>
  );
}
