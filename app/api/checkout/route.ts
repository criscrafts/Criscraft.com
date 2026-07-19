import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/sanity";
import { calculateItemUnitPrice, formatPrice } from "@/lib/cart";
import { calculateShippingCost, validateCheckoutForm } from "@/lib/validations";
import { CartCustomizations } from "@/types";

export const dynamic = "force-dynamic";

// Helper to generate a unique, high-end Order ID (e.g. CC-20260718-X9Z8)
function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CC-${dateStr}-${randomChars}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, items, notes, shippingMethod } = body;
    const paymentMethod = body?.paymentMethod || "WhatsApp Payment & Confirmation";

    // 1. Validate Form Fields
    const { isValid, errors } = validateCheckoutForm({
      customerName,
      phone,
      address,
      paymentMethod,
      shippingMethod,
    });

    if (!isValid || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // 2. Recalculate Prices Server-side to Prevent Client Price Injection
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let product = await getProductBySlug(item.productSlug);
      if (!product) {
        product = {
          _id: item.productId || "custom-product",
          title: item.title || "Handcrafted Bouquet",
          slug: item.productSlug || "custom-product",
          price: typeof item.unitPrice === "number" && item.unitPrice > 0 ? item.unitPrice : 0,
          discountPrice: undefined,
          description: "Handcrafted boutique item",
          images: [],
          category: { title: "Custom", slug: "custom" },
          availability: true,
        };
      }

      // Compute item price including options
      const itemUnitPrice = calculateItemUnitPrice(
        product.price,
        product.discountPrice,
        item.customizations as CartCustomizations,
        product
      );

      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      subtotal += itemUnitPrice * quantity;

      // Compile customization text for easier sheet reading
      const customizationsList: string[] = [];
      const c = (item.customizations || {}) as CartCustomizations;
      
      if (c.selectedOptions && Object.keys(c.selectedOptions).length > 0) {
        Object.entries(c.selectedOptions).forEach(([groupName, valName]) => {
          if (valName) customizationsList.push(`${groupName}: ${valName}`);
        });
      } else {
        if (c.flowerColor) customizationsList.push(`Color: ${c.flowerColor}`);
        if (c.ribbonColor) customizationsList.push(`Ribbon: ${c.ribbonColor}`);
      }

      if (c.selectedAddons && Array.isArray(c.selectedAddons)) {
        c.selectedAddons.forEach((addonName) => customizationsList.push(`Addon: ${addonName}`));
      } else {
        if (c.addGlitter) customizationsList.push(`Glitter (+50)`);
        if (c.addSnowPaper) customizationsList.push(`SnowPaper (+100)`);
      }

      if (c.customizedText) customizationsList.push(`Label: "${c.customizedText}"`);
      if (c.giftNote) customizationsList.push(`Gift Note: "${c.giftNote}"`);

      validatedItems.push({
        title: product.title,
        quantity,
        customizations: customizationsList.join(" | "),
        unitPrice: itemUnitPrice,
        totalPrice: itemUnitPrice * quantity,
      });
    }

    const shippingCost = calculateShippingCost(shippingMethod);
    const total = subtotal + shippingCost;
    const orderId = generateOrderId();
    const totalQuantity = validatedItems.reduce((sum, i) => sum + i.quantity, 0);

    // 3. Compile Product Summary Text for Google Sheets
    const productSummary = validatedItems
      .map(
        (item, idx) =>
          `[${idx + 1}] ${item.quantity}x ${item.title} (${
            item.customizations || "Standard"
          }) @ ${formatPrice(item.unitPrice)}`
      )
      .join("\n");

    // 4. Submit Order to Google Sheets via secure Google Apps Script Web App
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    let sheetSubmissionStatus = "Skipped (Config missing)";

    if (googleScriptUrl && googleScriptUrl !== "placeholder-url") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(googleScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            orderId,
            customerName: String(customerName).trim(),
            phone: String(phone).trim(),
            address: String(address).trim(),
            shippingMethod,
            shippingRegion: shippingMethod === "outside-valley" ? "Outside Valley (Rs. 250)" : "Inside Valley (Rs. 150)",
            totalQuantity,
            productSummary,
            subtotal,
            shippingCost,
            total,
            paymentMethod,
            notes: notes ? String(notes).trim() : "",
            createdAt: new Date().toISOString(),
            items: validatedItems,
          }),
        });

        clearTimeout(timeoutId);
        const resData = await response.json();
        if (resData.success) {
          sheetSubmissionStatus = "Success";
        } else {
          sheetSubmissionStatus = `Failed: ${resData.error || "Unknown Apps Script error"}`;
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.warn("Google Apps Script webhook call timed out after 12s. Continuing checkout.");
          sheetSubmissionStatus = "Timed out (Order logged locally)";
        } else {
          console.error("Failed contacting Google Apps Script API endpoint:", err);
          sheetSubmissionStatus = `Error: ${err.message || err.toString()}`;
        }
      }
    } else {
      console.warn("GOOGLE_SCRIPT_URL environment variable is missing. Submission to Google Sheets was bypassed.");
    }

    // 5. Return success structure, including prices and sheet details
    return NextResponse.json({
      success: true,
      orderId,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      sheetStatus: sheetSubmissionStatus,
    });
  } catch (error: any) {
    console.error("Serverless Checkout API Route encountered an exception error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server checkout error", details: error.message || error.toString() },
      { status: 500 }
    );
  }
}
