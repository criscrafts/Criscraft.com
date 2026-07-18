import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { getGlobalSettings } from "@/lib/sanity";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${poppins.variable} scroll-smooth`}
    >
      <body className="bg-warm-ivory text-deep-slate font-sans min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Navbar settings={settings} />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer settings={settings} />
          <FloatingWhatsAppButton whatsappNumber={settings?.whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  );
}
