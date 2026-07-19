import { CartItem, CartCustomizations } from "@/types";

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
 * Calculates the unit price of a cart item based on customizations and selected variant values.
 */
export function calculateItemUnitPrice(
  basePrice?: number | null,
  discountPrice?: number | null,
  customizations?: CartCustomizations,
  product?: any
): number {
  const safeBasePrice = typeof basePrice === "number" && !isNaN(basePrice) ? basePrice : 0;
  const safeDiscountPrice =
    typeof discountPrice === "number" && !isNaN(discountPrice) && discountPrice > 0
      ? discountPrice
      : undefined;

  let price = safeDiscountPrice !== undefined ? safeDiscountPrice : safeBasePrice;

  if (!customizations) return price;

  // Add-ons
  if (customizations.addGlitter) {
    price += 50; // Glitter is Rs. 50
  }
  if (customizations.addSnowPaper) {
    price += 100; // Snow paper is Rs. 100
  }

  // Variant Option pricing impact
  if (product?.variants && Array.isArray(product.variants)) {
    product.variants.forEach((v: any) => {
      const vName = v?.name?.toLowerCase() || "";
      let selectedValueName: string | undefined = undefined;

      if (vName.includes("color") || vName.includes("petal")) {
        selectedValueName = customizations.flowerColor;
      } else if (vName.includes("ribbon")) {
        selectedValueName = customizations.ribbonColor;
      } else {
        selectedValueName = customizations.flowerColor || customizations.ribbonColor;
      }

      if (selectedValueName && v?.options && Array.isArray(v.options)) {
        const option = v.options.find(
          (o: any) => o?.name?.toLowerCase() === selectedValueName!.toLowerCase()
        );
        if (option && typeof option.priceImpact === "number" && !isNaN(option.priceImpact)) {
          price += option.priceImpact;
        }
      }
    });
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

    // Standard & custom options
    if (item.customizations?.flowerColor) {
      itemsList += `   • Color: ${item.customizations.flowerColor}\n`;
    }
    if (item.customizations?.ribbonColor) {
      itemsList += `   • Ribbon: ${item.customizations.ribbonColor}\n`;
    }
    if (item.customizations?.addGlitter) {
      itemsList += `   • Add-on: Sparkly Glitter Dust (+Rs. 50)\n`;
    }
    if (item.customizations?.addSnowPaper) {
      itemsList += `   • Add-on: Textured Snow Paper (+Rs. 100)\n`;
    }
    if (item.customizations?.customizedText) {
      itemsList += `   • Custom Label: "${item.customizations.customizedText}"\n`;
    }
    if (item.customizations?.giftNote) {
      itemsList += `   • Gift Note: "${item.customizations.giftNote}"\n`;
    }

    itemsList += `   • Price: ${formatPrice(item.unitPrice)} each (${formatPrice(itemTotal)})\n\n`;
  });

  const rawMessage = `🎁 *CRISCRAFTS ORDER CONFIRMATION* 🎁
━━━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${params.orderId}
*Customer:* ${params.customerName}
*Phone:* ${params.phone}
*Delivery Address:* ${params.address}
*Shipping:* ${shippingRegion}

🛍️ *ORDER ITEMS:*
${itemsList.trim()}

━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY:*
• Items Subtotal: ${formatPrice(params.subtotal)}
• Shipping Fee: ${formatPrice(params.shippingCost)}
*Grand Total:* *${formatPrice(params.total)}*
━━━━━━━━━━━━━━━━━━━━━━
${params.notes ? `📝 *Special Instructions:* "${params.notes}"\n━━━━━━━━━━━━━━━━━━━━━━\n` : ""}
💬 *I would like to complete payment and confirm this order with CrisCrafts.* ❤️`;

  return encodeURIComponent(rawMessage);
}
