import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { getGlobalSettings } from "@/lib/sanity";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <CartProvider>
      <Navbar settings={settings} />
      <main className="flex-grow flex flex-col pt-24">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsAppButton whatsappNumber={settings?.whatsappNumber} />
    </CartProvider>
  );
}
