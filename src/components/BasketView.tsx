import React, { useState } from 'react';
import { MessageSquare, CircleDot, Sparkles, MapPin, Phone, User, QrCode, ClipboardCheck, ArrowLeft, Trash2, ShieldAlert, Minus, Plus } from 'lucide-react';
import { CartItem, CheckoutDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BasketViewProps {
  cartItems: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onClearBasket: () => void;
  onContinueShopping: () => void;
  onSubmitCheckout: (orderData: any) => Promise<void>; // isolated technical hook
}

export default function BasketView({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearBasket,
  onContinueShopping,
  onSubmitCheckout
}: BasketViewProps) {
  
  // Checkout form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryRegion, setDeliveryRegion] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Fonepay' | 'COD'>('Fonepay');
  
  // Modals & flows
  const [showFonepayQR, setShowFonepayQR] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.computedPrice * item.quantity), 0);
  const containsCustom = cartItems.some(item => item.isCustom);
  const totalAmount = subtotal + (containsCustom ? 0 : deliveryFee);

  // Checkout submit handler
  const handleCheckoutClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // Alphanumeric Order ID Generator
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const orderId = `CC-${randomSuffix}`;
    setGeneratedOrderId(orderId);

    // Form package details for database connectivity/isolated handleCheckoutSubmit parameter
    const orderDetailsPayload = {
      orderId,
      customerDetails: {
        name: customerName,
        phone: customerPhone,
        address: containsCustom ? 'Provided on WhatsApp' : deliveryAddress,
        deliveryRegion: containsCustom ? 'Custom Review' : deliveryRegion,
        deliveryFee: containsCustom ? 0 : deliveryFee,
        paymentMethod: containsCustom ? 'To Be Reviewed' : paymentMethod,
      },
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        isCustomStyle: item.isCustom,
        selectedOptions: item.selectedOptions,
        customBriefText: item.customDetailsText || '',
        priceComputed: item.computedPrice,
      })),
      totalPrice: totalAmount,
      containsCustom,
      timestamp: new Date().toISOString()
    };

    // Fire the isolated database compatibility helper
    await onSubmitCheckout(orderDetailsPayload);

    if (!containsCustom) {
      if (paymentMethod === 'Fonepay') {
        // Show QR modal. Submission continues from the modal
        setShowFonepayQR(true);
      } else {
        // Cash on delivery - direct success state
        triggerWhatsAppDeepLink(orderDetailsPayload, 'COD');
        setCheckoutCompleted(true);
      }
    } else {
      // Custom order route
      triggerWhatsAppDeepLink(orderDetailsPayload, 'CUSTOM_REVIEW');
      setCheckoutCompleted(true);
    }
  };

  // Build WhatsApp pre-formatted URL deep links
  const triggerWhatsAppDeepLink = (payload: any, mode: 'Fonepay' | 'COD' | 'CUSTOM_REVIEW') => {
    const creatorPhone = '9779860000000'; // Nepal formatting placeholder
    let text = `✨ *New Criscrafts Order Request* ✨\n`;
    text += `🆔 *Order ID:* ${payload.orderId}\n`;
    text += `👤 *Customer:* ${payload.customerDetails.name}\n`;
    text += `📞 *Phone:* ${payload.customerDetails.phone}\n`;
    
    if (mode !== 'CUSTOM_REVIEW') {
      text += `📍 *Delivery Region:* ${payload.customerDetails.deliveryRegion || 'N/A'} (Rs. ${payload.customerDetails.deliveryFee || 0}) | *Address:* ${payload.customerDetails.address}\n`;
      text += `💳 *Payment:* ${payload.customerDetails.paymentMethod}\n`;
    }

    text += `\n📦 *Order Cart List:*\n`;
    payload.items.forEach((item: any, index: number) => {
      text += `*${index + 1}. ${item.name}* (x${item.quantity})\n`;
      if (item.isCustomStyle) {
        text += `  ⚠️ [Bespoke Custom Request]\n`;
        text += `  📝 _Design Brief:_ "${item.customBriefText}"\n`;
      } else {
        Object.entries(item.selectedOptions).forEach(([title, val]: any) => {
          text += `  🔹 _${title}:_ ${val}\n`;
        });
      }
      text += `  💰 _Price:_ Rs. ${item.priceComputed * item.quantity}\n\n`;
    });

    text += `━━━━━━━━━━━━━━━\n`;
    if (mode === 'CUSTOM_REVIEW') {
      text += `🔸 *Notice:* Contains custom designs requiring review before payment.\n`;
    } else {
      text += `🚚 *Delivery Fee:* Rs. ${payload.customerDetails.deliveryFee || 0}\n`;
    }
    text += `⭐ *Grand Total:* Rs. ${payload.totalPrice}\n\n`;
    text += `🚀 Please finalize my order wrapping options and shipping estimates! Thank you.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${creatorPhone}?text=${encodedText}`;
    
    // Redirect
    window.open(whatsappUrl, '_blank');
  };

  // Complete QR checkout by deep linking on close or click
  const handleFonepayQRFinished = () => {
    setShowFonepayQR(false);
    const orderId = generatedOrderId || `CC-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockPayload = {
      orderId,
      customerDetails: {
        name: customerName,
        phone: customerPhone,
        address: deliveryAddress,
        deliveryRegion: deliveryRegion,
        deliveryFee: deliveryFee,
        paymentMethod: 'Fonepay / Scan',
      },
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        isCustomStyle: item.isCustom,
        selectedOptions: item.selectedOptions,
        customBriefText: item.customDetailsText || '',
        priceComputed: item.computedPrice
      })),
      totalPrice: totalAmount,
    };
    triggerWhatsAppDeepLink(mockPayload, 'Fonepay');
    setCheckoutCompleted(true);
  };

  return (
    <div id="basket-view-container" className="pt-28 md:pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
      
      {checkoutCompleted ? (
        /* ——————— SUCCESS CARD SECTION ——————— */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/40 text-center max-w-xl mx-auto space-y-6"
        >
          <div className="mx-auto w-20 h-20 bg-emerald-500/15 text-emerald-600 rounded-full flex items-center justify-center text-4xl animate-bounce">
            🎈
          </div>
          
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Order Routed Successfully!
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your order credentials have been configured. Let's finish discussing wrapping colors and delivery timings on WhatsApp.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl inline-flex flex-col items-center">
            <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              Generated Order Credentials
            </span>
            <span id="finish-order-id" className="font-mono text-lg font-black text-[#0099FF] tracking-wider mt-1">
              {generatedOrderId}
            </span>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              id="whatsapp-finalize-deeplink"
              onClick={() => {
                const randomSuffix = generatedOrderId.replace('CC-', '') || '502394';
                const mockObj = {
                  orderId: generatedOrderId,
                  customerDetails: {
                    name: customerName || 'Bespoke Patron',
                    phone: customerPhone || '9860000000',
                    address: containsCustom ? 'WhatsApp Review' : deliveryAddress,
                    deliveryRegion: containsCustom ? 'Custom Review' : deliveryRegion,
                    deliveryFee: containsCustom ? 0 : deliveryFee,
                    paymentMethod: containsCustom ? 'Custom review' : paymentMethod,
                  },
                  items: cartItems.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    isCustomStyle: item.isCustom,
                    selectedOptions: item.selectedOptions,
                    customBriefText: item.customDetailsText || '',
                    priceComputed: item.computedPrice,
                  })),
                  totalPrice: totalAmount
                };
                triggerWhatsAppDeepLink(mockObj, containsCustom ? 'CUSTOM_REVIEW' : paymentMethod);
              }}
              className="py-4 px-8 bg-emerald-500 text-white font-display font-bold text-sm rounded-full shadow-lg hover:bg-emerald-600 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Chat on WhatsApp to Finalize
            </button>

            <button
              id="back-home-success-btn"
              onClick={() => {
                onClearBasket();
                onContinueShopping();
              }}
              className="py-3 px-6 text-slate-500 hover:text-slate-800 font-sans text-xs font-bold cursor-pointer"
            >
              Clear Basket & Return Home
            </button>
          </div>
        </motion.div>
      ) : cartItems.length === 0 ? (
        /* ——————— EMPTY CART ——————— */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-12 rounded-[2.5rem] text-center space-y-6 max-w-md mx-auto"
        >
          <div className="text-5xl">🧺</div>
          <div className="space-y-2">
            <p className="font-display text-xl font-bold text-slate-900">Your Basket is Empty</p>
            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              Browse our handcrafted products section and pick combinations that fit your occasion or custom concepts.
            </p>
          </div>
          <button
            id="empty-basket-shop-btn"
            onClick={onContinueShopping}
            className="w-full py-3.5 bg-[#0099FF] text-white font-sans font-bold text-xs rounded-full shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            Explore Handcrafts catalog
          </button>
        </motion.div>
      ) : (
        /* ——————— ACTIVE BASKET LISTING ——————— */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* LEFT BASKET SUMMARY PANEL LIST */}
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-display text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
                🛍️ Your Selection
                <span className="text-xs bg-[#0099FF]/10 text-[#0099FF] px-2.5 py-1 rounded-full">{cartItems.length} items</span>
              </h2>
              <button
                _id="clear-all-basket-btn"
                onClick={onClearBasket}
                className="text-xs font-sans font-semibold text-red-500 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear All
              </button>
            </div>

            {/* Cart Items Iteration */}
            <div id="cart-items-list" className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  id={`cart-item-${item.cartId}`}
                  className="glass-panel p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/30 flex gap-3 sm:gap-4 items-center justify-between relative text-left group"
                >
                  {/* Left part: Compact Image and Details */}
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover" 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-display text-xs sm:text-sm font-bold text-slate-950 truncate">
                          {item.product.name}
                        </h4>
                        {item.isCustom ? (
                          <span className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider font-sans">
                            CUSTOM
                          </span>
                        ) : (
                          <span className="bg-[#E0F2FE] text-[#0099FF] px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider font-sans">
                            PRE
                          </span>
                        )}
                      </div>

                      {/* Mapped custom item specifications */}
                      {item.isCustom ? (
                        <p className="font-sans text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                          "{item.customDetailsText}"
                        </p>
                      ) : (
                        <div className="flex flex-row gap-2 flex-wrap max-h-4 overflow-hidden mt-0.5">
                          {Object.entries(item.selectedOptions).map(([key, val]) => (
                            <p key={key} className="font-sans text-[9px] sm:text-[10px] text-slate-400 font-semibold truncate">
                              <span className="text-slate-500">{key}:</span> {val}
                            </p>
                          ))}
                        </div>
                      )}

                      <div className="font-display text-[10px] sm:text-xs font-black text-slate-800 mt-0.5">
                        Rs. {item.computedPrice} each
                      </div>
                    </div>
                  </div>

                  {/* Right part: Compact Quantity Counter and Delete in single row */}
                  <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                    
                    {/* Quantity dialers */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/50 scale-90 sm:scale-100">
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="p-1 rounded-full bg-white hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Decrease"
                      >
                        <Minus size={9} />
                      </button>
                      <span className="font-display font-bold text-[11px] sm:text-xs px-2 sm:px-2.5 text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="p-1 rounded-full bg-white hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Increase"
                      >
                        <Plus size={9} />
                      </button>
                    </div>

                    {/* Trash Delete */}
                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-full transition hover:bg-red-50 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>

                  </div>
                </motion.div>
              ))}
            </div>

            {/* Back to shop navigation links */}
            <button
              onClick={onContinueShopping}
              className="inline-flex items-center gap-1.5 font-sans font-bold text-xs text-[#0099FF] hover:underline cursor-pointer"
            >
              <ArrowLeft size={13} />
              Add more items to basket
            </button>

          </div>

          {/* RIGHT SPLIT-CHECKOUT WORKBENCH FORM */}
          <div className="md:col-span-5">
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-white/40 space-y-6">
              
              <h3 className="font-display text-lg font-extrabold text-[#0F172A] text-left">
                Checkout Details
              </h3>

              <form onSubmit={handleCheckoutClick} className="space-y-5 text-left">
                
                {containsCustom ? (
                  /* ——————— CUSTOM DESIGN FLOW SUMMARY ——————— */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-200 text-pink-800 text-xs font-sans leading-relaxed flex items-start gap-2.5">
                      <ShieldAlert size={28} className="text-pink-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="font-bold">Custom Creator Review Required:</strong>
                        <p className="text-[11px] leading-relaxed">
                          Your basket contains bespoke custom layouts. Upfront billing payment and delivery addresses are hidden until the core design guidelines get verified by our artisans on WhatsApp.
                        </p>
                      </div>
                    </div>

                    {/* Standard Name / Contact form for custom order identification */}
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                          Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input 
                            required
                            type="text"
                            placeholder="Enter your full name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs bg-white/70"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input 
                            required
                            type="tel"
                            placeholder="e.g. 9860123456"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs bg-white/70"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* ——————— PRE-MADE CATALOG CHECKOUT FORM ——————— */
                  <div className="space-y-4">
                    
                    <div className="space-y-1">
                      <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                        Recipient Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          required
                          type="text"
                          placeholder="Your full name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs bg-white/70 focus:outline-[#0099FF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                        WhatsApp Call Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          required
                          type="tel"
                          placeholder="e.g. 9862121345"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs bg-white/70 focus:outline-[#0099FF]"
                        />
                      </div>
                    </div>

                    {/* Region Selection Dropdown */}
                    <div className="space-y-1">
                      <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                        Delivery Region *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <select
                          required
                          id="delivery-region-select"
                          value={deliveryRegion}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDeliveryRegion(val);
                            if (val === 'Inside Ring Road (Kathmandu)') {
                              setDeliveryFee(100);
                            } else if (val === 'Outside Ring Road (Kathmandu Valley)') {
                              setDeliveryFee(150);
                            } else if (val === 'Other Provinces (Outside Valley)') {
                              setDeliveryFee(250);
                            } else {
                              setDeliveryFee(0);
                            }
                          }}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs bg-white/70 focus:outline-[#0099FF] appearance-none cursor-pointer"
                        >
                          <option value="">Select a region...</option>
                          <option value="Inside Ring Road (Kathmandu)">Inside Ring Road (Kathmandu) - Rs. 100</option>
                          <option value="Outside Ring Road (Kathmandu Valley)">Outside Ring Road (Kathmandu Valley) - Rs. 150</option>
                          <option value="Other Provinces (Outside Valley)">Other Provinces (Outside Valley) - Rs. 250</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Cascading Reveal of Detailed Address */}
                    <AnimatePresence initial={false}>
                      {deliveryRegion && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-1 overflow-hidden"
                        >
                          <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                            Detailed Delivery Address *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
                            <textarea 
                              required
                              rows={2}
                              id="detailed-address-input"
                              placeholder="Tole name, House number, City details..."
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white/70 focus:outline-[#0099FF] resize-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Payment strategy Selector Toggle */}
                    <div className="space-y-2 pt-1">
                      <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1 block">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          id="pay-opt-fonepay"
                          onClick={() => setPaymentMethod('Fonepay')}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            paymentMethod === 'Fonepay'
                              ? 'bg-[#E0F2FE]/50 border-[#0099FF] text-slate-800 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <QrCode size={16} className="text-[#0099FF]" />
                          <span className="font-sans text-[11px]">Fonepay Scan QR</span>
                        </button>

                        <button
                          type="button"
                          id="pay-opt-cod"
                          onClick={() => setPaymentMethod('COD')}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            paymentMethod === 'COD'
                              ? 'bg-[#E0F2FE]/50 border-emerald-500 text-slate-800 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <CircleDot size={16} className="text-emerald-500" />
                          <span className="font-sans text-[11px]">Cash on Delivery</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* Amount checklist breakdown */}
                <div className="space-y-2 border-t border-slate-100 pt-5 text-slate-600 text-xs font-sans">
                  <div className="flex justify-between">
                    <span>Craft Subtotal</span>
                    <span className="font-bold text-slate-800">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-slate-800">
                      {containsCustom ? 'Calculated on WhatsApp' : (deliveryFee > 0 ? `Rs. ${deliveryFee}` : 'Select a Region')}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-display font-extrabold text-slate-900 border-t border-dashed border-slate-100 pt-3">
                    <span>Total Amount</span>
                    <span className="text-[#0099FF]" id="checkout-total-price">Rs. {totalAmount}</span>
                  </div>
                </div>

                {/* Curved CTA submission */}
                <button
                  type="submit"
                  id="checkout-submit-btn"
                  className="w-full py-4 rounded-full bg-[#0099FF] text-white font-display font-bold text-xs hover:scale-[1.02] active:scale-98 transition shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  {containsCustom ? (
                    <>
                      <Sparkles size={14} className="animate-spin" />
                      <span>Place Custom Order Review</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={14} />
                      <span>Proceed to Order Finalize →</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>
      )}

      {/* ——————— FONEPAY QR CODE LIQUID GLASS MODAL ——————— */}
      <AnimatePresence>
        {showFonepayQR && (
          <div id="fonepay-qr-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFonepayQR(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative p-6 sm:p-8 rounded-[2.5rem] bg-white text-slate-900 text-center max-w-sm w-full shadow-2xl border border-slate-200/80 space-y-6"
            >
              <div className="space-y-1">
                <span className="bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Fonepay Network
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 pt-1.5">
                  Scan and Pay Instantly
                </h3>
                <p className="font-sans text-[11px] text-slate-500 max-w-xs mx-auto">
                  Scan this curated merchant QR code using your Nepalese mobile banking client or Fonepay wallet app.
                </p>
              </div>

              {/* Vector Glass QR Container */}
              <div className="relative mx-auto w-48 h-48 bg-slate-50 border-2 border-dashed border-[#0099FF]/40 rounded-3xl p-3 flex items-center justify-center">
                
                {/* SVG mock QR drawing */}
                <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                  <rect x="11" y="11" width="13" height="13" fill="currentColor" rx="2" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                  <rect x="76" y="11" width="13" height="13" fill="currentColor" rx="2" />

                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" rx="4" />
                  <rect x="11" y="76" width="13" height="13" fill="currentColor" rx="2" />

                  {/* Aesthetic center brand point logo */}
                  <rect x="42" y="42" width="16" height="16" fill="#0099FF" rx="4" />
                  <circle cx="50" cy="50" r="4" fill="white" />

                  {/* Scramble code pixels */}
                  <rect x="40" y="10" width="8" height="6" fill="currentColor" />
                  <rect x="52" y="5" width="10" height="8" fill="currentColor" />
                  <rect x="45" y="20" width="12" height="6" fill="currentColor" />
                  
                  <rect x="10" y="40" width="7" height="9" fill="currentColor" />
                  <rect x="22" y="45" width="10" height="5" fill="currentColor" />
                  <rect x="5" y="55" width="12" height="6" fill="currentColor" />

                  <rect x="75" y="40" width="10" height="8" fill="currentColor" />
                  <rect x="88" y="45" width="7" height="12" fill="currentColor" />
                  
                  <rect x="40" y="65" width="8" height="10" fill="currentColor" />
                  <rect x="52" y="72" width="15" height="5" fill="currentColor" />
                  <rect x="45" y="85" width="10" height="8" fill="currentColor" />

                  <rect x="70" y="70" width="12" height="12" fill="currentColor" />
                  <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                </svg>

                {/* Laser scan line simulation */}
                <div className="absolute left-2 right-2 top-4 h-0.5 bg-red-400 opacity-60 animate-bounce" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                  <span>Merchant:</span>
                  <strong className="font-extrabold text-slate-900">CRISCRAFTS BOUQUE</strong>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                  <span>Total Due:</span>
                  <strong className="font-display font-black text-[#0099FF]">Rs. {totalAmount}</strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="confirm-payment-btn"
                  onClick={handleFonepayQRFinished}
                  className="w-full py-3.5 bg-slate-900 text-sky-400 font-display font-bold text-xs rounded-full shadow-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  I've Done The Payment ✓
                </button>
                <button
                  onClick={() => setShowFonepayQR(false)}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-sans text-xs font-semibold cursor-pointer"
                >
                  Cancel & Pay via Cash on Delivery
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
