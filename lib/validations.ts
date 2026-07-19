import { OrderPayload } from "@/types";

/**
 * Calculates shipping costs based on the shipping location/method selected.
 */
export function calculateShippingCost(method: string): number {
  switch (method) {
    case "inside-valley":
      return 150; // Inside Kathmandu Valley Rs. 150
    case "outside-valley":
      return 250; // Outside Kathmandu Valley Rs. 250
    default:
      return 150; // Default flat rate
  }
}

/**
 * Validates checkout form data input parameters.
 */
export function validateCheckoutForm(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const cleanName = data?.customerName ? String(data.customerName).trim() : "";
  if (!cleanName || cleanName.length < 3) {
    errors.customerName = "Name must be at least 3 characters long.";
  }

  const rawPhone = data?.phone ? String(data.phone).trim() : "";
  const sanitizedPhoneDigits = rawPhone.replace(/[\s\-\(\)]/g, "");
  const phoneRegex = /^[+]?[0-9]{9,15}$/;
  if (!rawPhone || !phoneRegex.test(sanitizedPhoneDigits)) {
    errors.phone = "Please enter a valid phone number (at least 9 digits).";
  }

  const cleanAddress = data?.address ? String(data.address).trim() : "";
  if (!cleanAddress || cleanAddress.length < 8) {
    errors.address = "Please enter a detailed shipping address (at least 8 characters).";
  }

  if (!data?.shippingMethod || (data.shippingMethod !== "inside-valley" && data.shippingMethod !== "outside-valley")) {
    errors.shippingMethod = "Please select a valid shipping area.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
