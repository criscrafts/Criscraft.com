import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingBag, Sparkles, Check, Heart, ShieldCheck } from 'lucide-react';
import { Product, CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToBasket: (cartItem: CartItem) => void;
}

export default function ProductDetail({ product, onBack, onAddToBasket }: ProductDetailProps) {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]); // option ids selected
  const [customBrief, setCustomBrief] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [mainOption, setMainOption] = useState<string>(''); // Single choice primary style (first option in options list)

  // Initialize main option if available
  useEffect(() => {
    if (product.options && product.options.length > 0) {
      // Find the first option that represents a Wrap selection
      const firstWrap = product.options.find(o => o.name.toLowerCase().includes('wrap') || o.name.toLowerCase().includes('selection') || o.name.toLowerCase().includes('color'));
      setMainOption(firstWrap ? firstWrap.id : product.options[0].id);
    }
    // Set scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Compute live single item price
  const computedSinglePrice = useEffect(() => {}, [isCustomMode, selectedAddOns, mainOption]);

  const singleItemPrice = React.useMemo(() => {
    if (isCustomMode) {
      // Custom layouts represent manual bespoke efforts. Let's add a curated +Rs. 100 design review/craft overlay fee, or just use basePrice.
      return product.basePrice + 150; // Custom design review addition
    }
    
    let price = product.basePrice;
    
    // Add main select modifier
    const mainOptObj = product.options.find(o => o.id === mainOption);
    if (mainOptObj) {
      price += mainOptObj.priceDelta;
    }

    // Add multi-select checklist modifiers
    selectedAddOns.forEach(optId => {
      // skip main option to avoid double counting
      if (optId === mainOption) return;
      const optObj = product.options.find(o => o.id === optId);
      if (optObj) {
        price += optObj.priceDelta;
      }
    });

    return price;
  }, [product, isCustomMode, selectedAddOns, mainOption]);

  // Handle add-on toggle check
  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Build checkout-safe custom state description
  const handleAddSubmit = () => {
    // Generate mapped options text
    const finalOptions: { [key: string]: string } = {};
    
    if (!isCustomMode) {
      const selectedMainObj = product.options.find(o => o.id === mainOption);
      if (selectedMainObj) {
        finalOptions['Base Selection'] = selectedMainObj.name;
      }
      
      const extraDetails: string[] = [];
      selectedAddOns.forEach(optId => {
        if (optId === mainOption) return;
        const optObj = product.options.find(o => o.id === optId);
        if (optObj) {
          extraDetails.push(`${optObj.name} (+Rs.${optObj.priceDelta})`);
        }
      });
      if (extraDetails.length > 0) {
        finalOptions['Decorations & Add-ons'] = extraDetails.join(', ');
      }
    } else {
      finalOptions['Custom Style'] = 'Bespoke Creator Layout';
    }

    const payload: CartItem = {
      cartId: `cart-${product.id}-${Date.now()}`,
      product,
      quantity,
      isCustom: isCustomMode,
      selectedOptions: finalOptions,
      customDetailsText: isCustomMode ? customBrief : undefined,
      computedPrice: singleItemPrice
    };

    onAddToBasket(payload);
  };

  // Categorize options into Main styles and Optional upgrades
  const primaryOptions = product.options.filter(o => o.name.toLowerCase().includes('wrap') || o.name.toLowerCase().includes('selection') || o.name.toLowerCase().includes('ring') || o.name.toLowerCase().includes('color'));
  const extrasOptions = product.options.filter(o => !primaryOptions.includes(o));

  return (
    <div id="product-detail-view" className="pt-28 md:pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto text-left">
      
      {/* Back navigation button */}
      <button 
        id="detail-back-button"
        onClick={onBack}
        className="inline-flex items-center gap-2 group text-slate-500 hover:text-[#0099FF] mb-8 font-sans font-semibold text-sm cursor-pointer"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Back to Catalog</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: HERO IMAGE AND SPECS */}
        <div className="md:col-span-5 space-y-6">
          <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100 p-2">
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                ★ {product.rating} (Verified Shop Rating)
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] space-y-3.5 border border-white/40">
            <h4 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500" />
              Criscrafts Promise
            </h4>
            <ul className="text-xs text-slate-500 space-y-2 font-sans list-disc list-inside">
              <li>Meticulously hand-folded from high-density fabrics.</li>
              <li>Durable structures that retain form infinitely.</li>
              <li>Packed in safety bubble cushions during dispatch.</li>
              <li>Live photos shared on WhatsApp before shipping.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION WORKBENCH */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Header Metadata */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#0369A1] border border-white/20">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                Material: {product.material}
              </span>
            </div>
            
            <h1 className="font-display text-3xl font-extrabold text-[#0F172A] leading-tight">
              {product.name}
            </h1>
            
            <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-slate-100/80 pt-6 space-y-6">
            
            {/* 1. SELECTION TOGGLE: PRE-MADE vs CUSTOM REQUEST */}
            <div className="space-y-3">
              <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Pricing Strategy</p>
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-full border border-slate-200/50">
                <button
                  id="toggle-pre-made"
                  onClick={() => setIsCustomMode(false)}
                  className={`py-3 rounded-full text-xs font-semibold font-sans transition-all duration-300 cursor-pointer ${
                    !isCustomMode 
                      ? 'bg-[#0099FF] text-white shadow' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Buy Pre-made Style
                </button>
                <button
                  id="toggle-custom-request"
                  onClick={() => setIsCustomMode(true)}
                  className={`py-3 rounded-full text-xs font-semibold font-sans transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCustomMode 
                      ? 'bg-[#0099FF] text-white shadow' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Sparkles size={13} className={isCustomMode ? "animate-spin" : ""} />
                  Request Custom Layout
                </button>
              </div>
            </div>

            {/* 2. DYNAMIC WORKSHOPS BASED ON TOGGLE */}
            <AnimatePresence mode="wait">
              {!isCustomMode ? (
                <motion.div
                  key="premade-workshop"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                >
                  
                  {/* Primary Selection Dropdown */}
                  {primaryOptions.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Base Style Options</p>
                      <div className="relative">
                        <select
                          value={mainOption}
                          onChange={(e) => setMainOption(e.target.value)}
                          className="w-full appearance-none bg-white/70 backdrop-blur-sm border border-slate-200 pl-4 pr-10 py-3.5 rounded-2xl font-sans text-xs font-bold text-slate-700 focus:outline-[#0099FF] cursor-pointer"
                        >
                          {primaryOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name} {opt.priceDelta > 0 ? `(+Rs. ${opt.priceDelta})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Extras multi selector list */}
                  {extrasOptions.length > 0 && (
                    <div className="space-y-2.5 text-left">
                      <p className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Aesthetic Add-ons & Bounty Upgrades</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {extrasOptions.map((opt) => {
                          const isChecked = selectedAddOns.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              id={`addon-btn-${opt.id}`}
                              onClick={() => handleToggleAddOn(opt.id)}
                              className={`p-3.5 rounded-2xl border text-left font-sans text-xs transition-all duration-200 flex items-center justify-between cursor-pointer ${
                                isChecked 
                                  ? 'bg-[#E0F2FE]/60 border-[#0099FF] text-slate-800 shadow-sm' 
                                  : 'bg-white/50 border-slate-200 text-slate-600 hover:border-[#0099FF]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  isChecked ? 'bg-[#0099FF] border-[#0099FF]' : 'border-slate-300'
                                }`}>
                                  {isChecked && <Check size={10} className="text-white" />}
                                </div>
                                <span className="font-semibold leading-tight">{opt.name.replace(': ', ':\n')}</span>
                              </div>
                              <span className="font-display font-bold text-slate-700 block whitespace-nowrap ml-2">
                                +Rs.{opt.priceDelta}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </motion.div>
              ) : (
                <motion.div
                  key="custom-workshop"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block text-left">
                      Bespoke Design Brief
                    </label>
                    <textarea
                      id="custom-details-textarea"
                      value={customBrief}
                      onChange={(e) => setCustomBrief(e.target.value)}
                      placeholder="Describe your custom design details here, e.g., 'I want a pastel yellow ribbon rose bouquet mixed with white fuzzy wire bunny ears wrapped in rustic vintage kraft paper, themed for a kid graduation. Please add an acrylic name tag saying Mia!'"
                      className="w-full h-36 p-4 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF] leading-relaxed transition-all resize-none shadow-inner"
                    />
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-800 text-[11px] font-sans leading-relaxed text-left">
                      💡 <strong>Custom Design Fee Added:</strong> Bespoke custom layout requests require our master artisan review and carry a standard premium setup cost (+Rs. 150). We will mock up design variations and share drafts with you on WhatsApp!
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. QUANTITY SELECTOR AND ACTION CTA FOOTER */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Dial Quantity counter */}
              <div className="flex items-center gap-4">
                <span className="font-sans text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Qty</span>
                <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/50">
                  <button
                    id="quantity-decrease"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-full hover:bg-white text-slate-600 hover:text-slate-800 transition shadow-inner cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-display font-extrabold text-sm px-4 select-none text-slate-800">
                    {quantity}
                  </span>
                  <button
                    id="quantity-increase"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-1.5 rounded-full hover:bg-white text-slate-600 hover:text-slate-800 transition shadow-inner cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Summary and Curved Action Button */}
              <div className="flex items-center gap-5 justify-between sm:justify-end flex-initial">
                <div className="text-right">
                  <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Price</p>
                  <p className="font-display text-2xl font-black text-[#0099FF]">
                    Rs. {singleItemPrice * quantity}
                  </p>
                </div>

                <button
                  id="add-to-basket-btn"
                  onClick={handleAddSubmit}
                  disabled={isCustomMode && !customBrief.trim()}
                  className={`relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-display font-bold text-sm shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ${
                    isCustomMode && !customBrief.trim()
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-[#0099FF] text-white hover:scale-[1.03] active:scale-95 shadow-blue-500/10 hover:shadow-xl'
                  }`}
                >
                  <ShoppingBag size={15} />
                  <span>Add to Basket</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
