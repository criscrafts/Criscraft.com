import { CartItem, CartCustomizations, Product, Addon, ProductOptionGroup, ProductOptionValue } from "@/types";

/**
 * Formats a numeric price into a luxury Nepalese Rupee string.
 */
export function formatPrice(amount?: number | null): string {
  if (amount === null || amount === undefined || typeof amount !== "number" || isNaN(amount)) {
    return "Rs. 0";
  }
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

/**
 * Calculates the unit price of a cart item based on option group selections and add-ons.
 */
export function calculateItemUnitPrice(
  basePrice?: number | null,
  discountPrice?: number | null,
  customizations?: CartCustomizations,
  product?: Product | null
): number {
  const safeBasePrice = typeof basePrice === "number" && !isNaN(basePrice) ? basePrice : 0;
  const safeDiscountPrice =
    typeof discountPrice === "number" && !isNaN(discountPrice) && discountPrice > 0
      ? discountPrice
      : undefined;

  let price = safeDiscountPrice !== undefined ? safeDiscountPrice : safeBasePrice;

  if (!customizations) return price;

  // 1. Process Dynamic Option Groups Price Impacts
  if (customizations.selectedOptions && product?.optionGroups) {
    product.optionGroups.forEach((group: ProductOptionGroup) => {
      const selectedValueName = customizations.selectedOptions?.[group.name];
      if (selectedValueName && group.options) {
        const matchedOpt = group.options.find(
          (opt: ProductOptionValue) => opt.name === selectedValueName || opt.value === selectedValueName
        );
        if (matchedOpt && typeof matchedOpt.priceImpact === "number" && matchedOpt.priceImpact > 0) {
          price += matchedOpt.priceImpact;
        }
      }
    });
  }

  // 2. Process Reusable Add-ons Pricing
  if (customizations.selectedAddons && Array.isArray(customizations.selectedAddons)) {
    customizations.selectedAddons.forEach((addonIdOrName) => {
      const matchedAddon = product?.addons?.find(
        (a: Addon) => a._id === addonIdOrName || a.name === addonIdOrName || a.slug === addonIdOrName
      );
      if (matchedAddon && typeof matchedAddon.price === "number") {
        price += matchedAddon.price;
      } else {
        // Fallback default add-on pricing
        if (addonIdOrName.toLowerCase().includes("glitter")) price += 50;
        else if (addonIdOrName.toLowerCase().includes("snow")) price += 100;
        else if (addonIdOrName.toLowerCase().includes("pearl")) price += 150;
        else if (addonIdOrName.toLowerCase().includes("light")) price += 250;
        else if (addonIdOrName.toLowerCase().includes("teddy")) price += 350;
      }
    });
  }

  // Backward compatibility add-ons
  if (customizations.addGlitter && !customizations.selectedAddons?.includes("glitter-dust")) {
    price += 50;
  }
  if (customizations.addSnowPaper && !customizations.selectedAddons?.includes("snow-paper")) {
    price += 100;
  }

  return price;
}

/**
 * Compiles a detailed multi-line text summary of a customer's order for WhatsApp transmission.
 */
export function compileWhatsAppMessage(params: {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
}): string {
  const shippingRegion = params.shippingCost === 250 ? "Outside Valley (Rs. 250)" : "Inside Valley (Rs. 150)";

  let itemsList = "";
  params.items.forEach((item, idx) => {
    const itemTotal = item.unitPrice * item.quantity;
    itemsList += `${idx + 1}️⃣ *${item.quantity}x ${item.product.title}*\n`;

    const c = item.customizations;

    // Output all configured option groups (Size, Color, Wrapper, etc.)
    if (c.selectedOptions && Object.keys(c.selectedOptions).length > 0) {
      Object.entries(c.selectedOptions).forEach(([groupName, valName]) => {
        if (valName) {
          itemsList += `   • ${groupName}: ${valName}\n`;
        }
      });
    } else {
      if (c.flowerColor) itemsList += `   • Flower Color: ${c.flowerColor}\n`;
      if (c.ribbonColor) itemsList += `   • Ribbon: ${c.ribbonColor}\n`;
    }

    // Output all selected add-ons
    if (c.selectedAddons && c.selectedAddons.length > 0) {
      c.selectedAddons.forEach((addonName) => {
        itemsList += `   • Add-on: ${addonName}\n`;
      });
    } else {
      if (c.addGlitter) itemsList += `   • Add-on: Spray Sparkly Glitter Dust (+Rs. 50)\n`;
      if (c.addSnowPaper) itemsList += `   • Add-on: Textured Snow Paper (+Rs. 100)\n`;
    }

    // Output Gift Card Message
    if (c.giftNote) {
      itemsList += `   • 💌 Gift Card Note: "${c.giftNote}"\n`;
    }

    // Output Special Customization Notes (Must be explicitly detailed)
    if (c.customizedText) {
      itemsList += `   • 📝 Special Customization Notes: "${c.customizedText}"\n`;
    }

    itemsList += `   • Unit Price: ${formatPrice(item.unitPrice)} | Total: ${formatPrice(itemTotal)}\n\n`;
  });

  const rawMessage = `🎁 *CRISCRAFTS ORDER CONFIRMATION* 🎁
━━━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${params.orderId}
*Customer:* ${params.customerName}
*Phone:* ${params.phone}
*Delivery Address:* ${params.address}
*Shipping:* ${shippingRegion}

🛍️ *ORDER ITEMS & CUSTOMIZATIONS:*
${itemsList.trim()}

━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY:*
• Items Subtotal: ${formatPrice(params.subtotal)}
• Shipping Fee: ${formatPrice(params.shippingCost)}
*Grand Total:* *${formatPrice(params.total)}*
━━━━━━━━━━━━━━━━━━━━━━
${params.notes ? `📝 *General Order Notes:* "${params.notes}"\n━━━━━━━━━━━━━━━━━━━━━━\n` : ""}
💬 *I would like to complete payment and confirm this order with CrisCrafts.* ❤️`;

  return encodeURIComponent(rawMessage);
}
