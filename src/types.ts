export interface CustomizationOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Bouquet' | 'Keyring';
  material: 'Ribbon' | 'Fuzzy Wire' | 'Chocolates';
  basePrice: number;
  image: string;
  rating: number;
  popular?: boolean;
  options: CustomizationOption[];
}

export interface CartItem {
  cartId: string; // Unique ID in the basket
  product: Product;
  quantity: number;
  isCustom: boolean; // Pre-made style vs. Request custom design
  selectedOptions: {
    [optionName: string]: string; // name to selected name mapping
  };
  customDetailsText?: string; // Rich description for custom requests
  computedPrice: number; // Final price per single item
}

export interface CheckoutDetails {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: 'Fonepay' | 'COD';
}

export interface OccasionTheme {
  id: string;
  label: string;
  eventName: string;
  tint: string;                  // tailwind gradient styles (e.g. "from-pink-100 to-sky-200")
  accentBg: string;              // background accent color (e.g. "pink")
  glassStyle: 'pink-glass-panel' | 'ocean-glass-panel' | 'glass-panel' | 'dark-glass-panel';
  tagline: string;
  tagColor: string;               // badge color classes
}
