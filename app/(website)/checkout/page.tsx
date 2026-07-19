"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Truck, Clipboard, ShieldCheck, ShoppingBag, ArrowLeft, Loader2, MessageCircle, Heart, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { calculateShippingCost, validateCheckoutForm } from "@/lib/validations";
import { formatPrice, compileWhatsAppMessage } from "@/lib/cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartSubtotal, clearCart } = useCart();

  // Redirect if cart is empty after initial load
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("inside-valley"); // inside-valley or outside-valley
  const [notes, setNotes] = useState("");
  
  // UI Helpers
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computations
  const shippingCost = useMemo(() => calculateShippingCost(shippingMethod), [shippingMethod]);
  const totalAmount = useMemo(() => cartSubtotal + shippingCost, [cartSubtotal, shippingCost]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate client-side first
    const { isValid, errors: validationErrors } = validateCheckoutForm({
      customerName,
      phone,
      address,
      shippingMethod,
    });

    if (!isValid) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Map cart items to API payload
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        productSlug: item.product.slug,
        title: item.product.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customizations: item.customizations,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          shippingMethod,
          paymentMethod: "WhatsApp Payment",
          notes,
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store details in sessionStorage for the Success Page summary display
        sessionStorage.setItem(
          "criscrafts_last_order",
          JSON.stringify({
            orderId: data.orderId,
            customerName,
            phone,
            address,
            paymentMethod: "WhatsApp Payment",
            subtotal: data.subtotal,
            shippingCost: data.shippingCost,
            total: data.total,
            notes,
            items,
          })
        );

        // Compile pre-filled WhatsApp message
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+9779800000000";
        const encodedMessage = compileWhatsAppMessage({
          orderId: data.orderId,
          customerName,
          phone,
          address,
          items,
          subtotal: data.subtotal,
          shippingCost: data.shippingCost,
          total: data.total,
          paymentMethod: "WhatsApp Payment",
          notes,
        });

        // Clear cart context
        clearCart();
        
        // Open WhatsApp window with pre-filled message
        window.open(`https://wa.me/${whatsappNumber.replace(/[+]/g, "")}?text=${encodedMessage}`, "_blank");

        // Go to success screen
        router.push("/success");
      } else {
        alert(data.error || "An error occurred while compiling your order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout submit error:", error);
      alert("Network connection error. Failed to reach server checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isPageLoaded) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-soft-gold animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center font-sans px-6 text-center">
        <div className="max-w-md flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pastel-peach flex items-center justify-center text-soft-gold shadow-inner mb-2">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-deep-slate">Your cart is empty</h2>
          <p className="text-sm text-dark-gray/70 leading-relaxed">
            You must add items to your cart before proceeding to checkout. Let's find something handcrafted for you.
          </p>
          <Link href="/shop" passHref>
            <Button variant="primary" className="mt-2">
              Return to Boutique Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans min-h-screen bg-warm-ivory bg-artisan-grid pt-20 sm:pt-22 lg:pt-24 pb-16 text-left">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-dark-gray/60 hover:text-soft-gold transition-colors duration-300 mb-10 pl-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate mb-12 tracking-wide">
          Boutique Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Delivery & Payment Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-8">
            {/* Customer Details */}
            <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-soft-gold/15 bg-soft-cream/20 relative overflow-hidden">
              <div className="flex items-center gap-3 border-b border-soft-gold/10 pb-4">
                <Clipboard className="w-5 h-5 text-soft-gold" />
                <h3 className="font-serif text-xl text-deep-slate">Customer Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="customerName"
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={errors.customerName}
                  required
                />
                <Input
                  label="Phone Number"
                  id="phone"
                  placeholder="e.g. 9800000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  required
                  helperText="Required for WhatsApp verification."
                />
              </div>

              <Input
                label="Detailed Shipping Address"
                id="address"
                placeholder="Street name, building number, city, landmarks"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                required
              />
            </div>

            {/* Shipping selection area */}
            <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-soft-gold/15 bg-soft-cream/20">
              <div className="flex items-center gap-3 border-b border-soft-gold/10 pb-4">
                <Truck className="w-5 h-5 text-soft-gold" />
                <h3 className="font-serif text-xl text-deep-slate">Shipping Region</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setShippingMethod("inside-valley")}
                  className={`flex flex-col gap-2 p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                    shippingMethod === "inside-valley"
                      ? "border-soft-gold bg-soft-cream/80 ring-1 ring-soft-gold/30 shadow-luxury-sm"
                      : "border-soft-gold/10 bg-transparent hover:border-soft-gold/40"
                  }`}
                >
                  <span className="text-sm font-semibold text-deep-slate uppercase tracking-wider">
                    Inside Valley
                  </span>
                  <span className="text-xs text-dark-gray/80 leading-normal">
                    Kathmandu, Lalitpur & Bhaktapur deliveries.
                  </span>
                  <span className="text-sm font-semibold text-soft-gold mt-2">
                    {formatPrice(150)}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod("outside-valley")}
                  className={`flex flex-col gap-2 p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                    shippingMethod === "outside-valley"
                      ? "border-soft-gold bg-soft-cream/80 ring-1 ring-soft-gold/30 shadow-luxury-sm"
                      : "border-soft-gold/10 bg-transparent hover:border-soft-gold/40"
                  }`}
                >
                  <span className="text-sm font-semibold text-deep-slate uppercase tracking-wider">
                    Outside Valley
                  </span>
                  <span className="text-xs text-dark-gray/80 leading-normal">
                    Nationwide express shipping to major cities.
                  </span>
                  <span className="text-sm font-semibold text-soft-gold mt-2">
                    {formatPrice(250)}
                  </span>
                </label>
              </div>
            </div>

            {/* WhatsApp Payment & Order Confirmation Panel */}
            <div className="flex flex-col gap-5 p-6 sm:p-8 rounded-3xl border border-soft-gold/20 bg-soft-cream/30 relative overflow-hidden">
              <div className="flex items-center gap-3 border-b border-soft-gold/10 pb-4">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <h3 className="font-serif text-xl text-deep-slate">Payment & Order Confirmation</h3>
              </div>

              <div className="flex flex-col gap-3 font-sans text-sm text-charcoal/85 leading-relaxed">
                <p>
                  At CrisCrafts, all handcrafted orders (both standard catalog items and custom options) are completed & paid directly via <strong>WhatsApp</strong>.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <div className="p-4 rounded-2xl bg-warm-ivory border border-soft-gold/15 flex flex-col gap-1 text-xs">
                    <span className="font-bold text-soft-gold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-soft-gold" /> 1. Click Button
                    </span>
                    <span className="text-dark-gray/70">Submit details & generate order ID</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-warm-ivory border border-soft-gold/15 flex flex-col gap-1 text-xs">
                    <span className="font-bold text-[#25D366] uppercase tracking-wider flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-[#25D366]" /> 2. WhatsApp
                    </span>
                    <span className="text-dark-gray/70">Opens pre-filled message with order specs</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-warm-ivory border border-soft-gold/15 flex flex-col gap-1 text-xs">
                    <span className="font-bold text-soft-gold uppercase tracking-wider flex items-center gap-1">
                      <Heart className="w-3 h-3 text-muted-rose" /> 3. Complete Payment
                    </span>
                    <span className="text-dark-gray/70">Confirm delivery & payment with studio team</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="flex flex-col gap-2.5 font-sans">
              <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/80 pl-1">
                Additional Order Notes (Optional)
              </label>
              <textarea
                placeholder="E.g. specific delivery times, building access, or custom notes."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-soft-gold/25 focus:border-soft-gold bg-warm-ivory text-sm text-deep-slate outline-none placeholder:text-dark-gray/30 resize-none"
              />
            </div>
          </form>

          {/* Right Column: Order Summary Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6 text-left">
            <div className="p-6 sm:p-8 rounded-3xl border border-soft-gold/15 bg-soft-cream/20 shadow-luxury-sm">
              <h3 className="font-serif text-xl text-deep-slate border-b border-soft-gold/10 pb-4 mb-6">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="flex flex-col gap-5 max-h-[320px] overflow-y-auto pr-2 scrollbar-none border-b border-soft-gold/10 pb-6 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start font-sans">
                    <div className="relative w-14 h-14 bg-soft-cream border border-soft-gold/10 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images?.[0] || ""}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <h4 className="text-sm font-semibold text-deep-slate truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[10px] text-dark-gray/60">
                        Qty: {item.quantity} • {formatPrice(item.unitPrice)} each
                      </p>
                      
                      {/* customizations details */}
                      <span className="text-[10px] text-soft-gold/90 truncate max-w-[220px]">
                        {(() => {
                          const parts: string[] = [];
                          if (item.customizations?.selectedOptions) {
                            Object.values(item.customizations.selectedOptions).forEach((v) => parts.push(v));
                          } else {
                            if (item.customizations?.flowerColor) parts.push(item.customizations.flowerColor);
                            if (item.customizations?.ribbonColor) parts.push(item.customizations.ribbonColor);
                          }
                          if (item.customizations?.selectedAddons) {
                            item.customizations.selectedAddons.forEach((a) => parts.push(a.replace("addon-", "")));
                          }
                          if (item.customizations?.customizedText) {
                            parts.push(`Note: "${item.customizations.customizedText}"`);
                          }
                          return parts.filter(Boolean).join(" • ");
                        })()}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-deep-slate whitespace-nowrap">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* pricing totals */}
              <div className="flex flex-col gap-3 font-sans text-sm border-b border-soft-gold/10 pb-6 mb-6">
                <div className="flex justify-between text-charcoal">
                  <span>Subtotal</span>
                  <span className="font-semibold text-deep-slate">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-deep-slate">{formatPrice(shippingCost)}</span>
                </div>
              </div>

              {/* Total amount */}
              <div className="flex justify-between items-center font-sans text-base mb-8">
                <span className="font-serif text-lg text-deep-slate font-medium">Grand Total</span>
                <span className="font-serif text-xl font-bold text-deep-slate">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Submit CTA button */}
              <Button
                variant="gold"
                onClick={handleSubmit}
                className="w-full py-3.5 text-base font-semibold shadow-luxury hover:shadow-luxury-lg bg-[#25D366] hover:bg-[#20ba5a] text-white border-none"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5 fill-current" />}
              >
                {isSubmitting ? "Generating WhatsApp Order..." : "Complete Order & Pay via WhatsApp"}
              </Button>

              <p className="text-[11px] text-dark-gray/60 leading-normal text-center mt-4 font-sans">
                Clicking complete will open WhatsApp with your full order specifications to verify transaction details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
