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
  paymentMethod: "cod" | "qr";
  notes?: string;
}): string {
  const paymentText = params.paymentMethod === "qr" ? "QR Payment (Awaiting Verification)" : "Cash on Delivery (COD)";
  
  let itemsList = "";
  params.items.forEach((item, idx) => {
    let customDetails = [];
    if (item.customizations.flowerColor) customDetails.push(`Color: ${item.customizations.flowerColor}`);
    if (item.customizations.ribbonColor) customDetails.push(`Ribbon: ${item.customizations.ribbonColor}`);
    if (item.customizations.addGlitter) customDetails.push(`Add-on: Glitter (+Rs. 50)`);
    if (item.customizations.addSnowPaper) customDetails.push(`Wrap: Snow Paper (+Rs. 100)`);
    if (item.customizations.customizedText) customDetails.push(`Label: "${item.customizations.customizedText}"`);
    if (item.customizations.giftNote) customDetails.push(`Gift Note: "${item.customizations.giftNote}"`);
    
    const detailsStr = customDetails.length > 0 ? ` [${customDetails.join(", ")}]` : "";
    itemsList += `${idx + 1}. ${item.quantity}x ${item.product.title}${detailsStr} - ${formatPrice(item.unitPrice * item.quantity)}\n`;
  });

  const rawMessage = `✨ *CrisCrafts Artisan Order Confirmation* ✨
----------------------------------
*Order ID:* ${params.orderId}
*Customer Name:* ${params.customerName}
*Phone Number:* ${params.phone}
*Shipping Address:* ${params.address}
*Payment Method:* ${paymentText}
${params.notes ? `*Customer Note:* "${params.notes}"\n` : ""}
*Items Ordered:*
${itemsList}
*Summary Pricing:*
- Subtotal: ${formatPrice(params.subtotal)}
- Shipping Cost: ${formatPrice(params.shippingCost)}
----------------------------------
*Total Amount Payable:* ${formatPrice(params.total)}

Thank you for choosing handmade quality made with love! ❤️`;

  return encodeURIComponent(rawMessage);
}
