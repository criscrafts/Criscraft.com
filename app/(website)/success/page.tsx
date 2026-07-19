"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Home, Calendar, Truck, Heart, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { formatPrice, compileWhatsAppMessage } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);

  // Retrieve last checkout session order details
  useEffect(() => {
    const lastOrder = sessionStorage.getItem("criscrafts_last_order");
    if (lastOrder) {
      try {
        setOrder(JSON.parse(lastOrder));
      } catch (err) {
        console.error("Failed to parse last order from sessionStorage", err);
      }
    }

    // Fire Confetti on load
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti shoots from left and right corners
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Compute estimated delivery window (3 to 5 business days from current date)
  const deliveryRange = React.useMemo(() => {
    const today = new Date();
    const deliveryMin = new Date(today);
    deliveryMin.setDate(today.getDate() + 3);
    const deliveryMax = new Date(today);
    deliveryMax.setDate(today.getDate() + 5);

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${deliveryMin.toLocaleDateString("en-US", options)} - ${deliveryMax.toLocaleDateString("en-US", options)}`;
  }, []);

  const handleWhatsAppRedirect = () => {
    if (!order) return;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+9779800000000";
    
    // Compile formatted WhatsApp order confirmation details
    const encodedMessage = compileWhatsAppMessage({
      orderId: order.orderId,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
    });

    window.open(`https://wa.me/${whatsappNumber.replace(/[+]/g, "")}?text=${encodedMessage}`, "_blank");
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center font-sans px-6 text-center">
        <div className="max-w-md flex flex-col items-center gap-4">
          <CheckCircle2 className="w-16 h-16 text-soft-gold mb-2" />
          <h2 className="font-serif text-2xl text-deep-slate">Thank you for your purchase!</h2>
          <p className="text-sm text-dark-gray/70 leading-relaxed">
            Your order is being reviewed by our master artisans. If you did not redirect here from checkout, click below to visit the boutique home.
          </p>
          <Link href="/" passHref>
            <Button variant="primary" className="mt-2">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans min-h-screen bg-warm-ivory bg-artisan-grid pt-20 sm:pt-22 lg:pt-24 pb-16 text-left">
      {/* Background Visual Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-pastel-peach/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-pastel-blue/20 blur-[80px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 relative z-10">
        {/* Success Header banner */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-soft-gold/10 text-soft-gold flex items-center justify-center shadow-inner animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate leading-tight">
              Thank you for your order
            </h1>
            <p className="text-sm text-charcoal/80 max-w-md leading-relaxed mt-1">
              Your order has been logged in our system. Let's send a WhatsApp message to our artisan desk to verify details and begin crafting!
            </p>
          </div>
        </div>

        {/* Action Button: Send WhatsApp Details */}
        <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-soft-gold/25 shadow-luxury-lg mb-8 flex flex-col gap-5 items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-28 h-28 bg-[#25D366]/10 rounded-full pointer-events-none" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#25D366] uppercase tracking-wider pl-1">
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" /> Final Order Step
          </div>
          <h3 className="font-serif text-xl text-deep-slate max-w-sm">
            Complete Payment & Confirm via WhatsApp
          </h3>
          <p className="text-xs text-charcoal/80 max-w-md leading-relaxed">
            If your WhatsApp tab did not open automatically, click the button below to send your prefilled order specifications, standard/custom options, and complete payment with our team.
          </p>
          
          <Button
            variant="gold"
            onClick={handleWhatsAppRedirect}
            className="w-full sm:w-auto px-8 py-3.5 text-sm uppercase tracking-wider font-bold shadow-luxury hover:shadow-luxury-lg mt-2 bg-[#25D366] hover:bg-[#20ba5a] text-white border-none"
            leftIcon={<MessageCircle className="w-5 h-5 fill-current" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Confirm & Pay via WhatsApp
          </Button>
        </div>

        {/* Order Details & Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-soft-gold/15 bg-soft-cream/20 shadow-luxury-sm mb-8 flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-soft-gold/10 pb-4">
            <span className="text-xs uppercase tracking-widest font-bold text-dark-gray/60">Order ID:</span>
            <span className="font-mono text-sm font-semibold text-deep-slate select-all">{order.orderId}</span>
          </div>

          {/* Pricing breakdown */}
          <div className="flex flex-col gap-2 font-sans text-sm">
            <div className="flex justify-between text-charcoal">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal">
              <span>Shipping Cost:</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-serif text-base font-medium text-deep-slate border-t border-soft-gold/10 pt-3 mt-1">
              <span>Total Paid/Payable:</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Fulfillment Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl border border-soft-gold/15 bg-soft-cream/20 shadow-luxury-sm mb-10 flex flex-col gap-6">
          <h3 className="font-serif text-lg font-normal text-deep-slate border-b border-soft-gold/10 pb-3">
            Fulfillment Timeline
          </h3>

          <div className="flex flex-col gap-6 relative font-sans pl-6 border-l border-soft-gold/25 ml-3 text-sm">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-soft-gold border-4 border-warm-ivory flex items-center justify-center shadow-sm" />
              <div className="flex flex-col text-left gap-1">
                <span className="font-semibold text-deep-slate">Order Placed</span>
                <span className="text-xs text-dark-gray/70">Your payment and address details are recorded in our ledger.</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-soft-gold/30 border-4 border-warm-ivory flex items-center justify-center shadow-sm" />
              <div className="flex flex-col text-left gap-1">
                <span className="font-semibold text-charcoal">Artisan Studio Verification</span>
                <span className="text-xs text-dark-gray/70">We align specifications via the WhatsApp chat thread.</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-soft-gold/30 border-4 border-warm-ivory flex items-center justify-center shadow-sm" />
              <div className="flex flex-col text-left gap-1">
                <span className="font-semibold text-charcoal">Handcrafting & Wrapping</span>
                <span className="text-xs text-dark-gray/70">Bouquets are hand-assembled and plushies are knitted stitch by stitch.</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-soft-gold/30 border-4 border-warm-ivory flex items-center justify-center shadow-sm" />
              <div className="flex flex-col text-left gap-1">
                <span className="font-semibold text-charcoal">Dispatched & Delivered</span>
                <span className="text-xs text-dark-gray/70">Shipped via express courier with signature verification.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-warm-ivory p-4 rounded-2xl border border-soft-gold/10 text-xs text-charcoal/80">
            <div className="flex items-center gap-2 font-semibold text-soft-gold flex-shrink-0">
              <Calendar className="w-4 h-4" /> Estimated Delivery:
            </div>
            <div>{deliveryRange} ({formatPrice(order.shippingCost)} area tier)</div>
          </div>
        </div>

        {/* Back Home CTA Button */}
        <div className="text-center">
          <Link href="/" passHref>
            <Button variant="outline" className="px-8" leftIcon={<Home className="w-4 h-4" />}>
              Return to Boutique Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
