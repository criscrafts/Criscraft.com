export interface ProductVariantOption {
  name: string;
  priceImpact?: number;
}

export interface ProductVariant {
  name: string; // e.g. "Flower Color", "Ribbon Color"
  options: ProductVariantOption[];
  required?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[]; // URLs or Sanity asset refs
  category: {
    title: string;
    slug: string;
  };
  collections?: string[];
  availability: boolean;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  variants?: ProductVariant[];
  hasGlitterOption?: boolean; // customized craft additions
  hasSnowPaperOption?: boolean;
  hasGiftNoteOption?: boolean;
  featured?: boolean;
}

export interface CartCustomizations {
  ribbonColor?: string;
  flowerColor?: string;
  addGlitter?: boolean;
  addSnowPaper?: boolean;
  giftNote?: string;
  customizedText?: string;
}

export interface CartItem {
  id: string; // Unique slug + serialization of customizations
  product: Product;
  quantity: number;
  customizations: CartCustomizations;
  unitPrice: number; // Base price + add-ons
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Testimonial {
  _id: string;
  author: string;
  role?: string;
  text: string;
  rating: number;
  avatar?: string;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface OrderPayload {
  customerName: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    title: string;
    quantity: number;
    customizations: CartCustomizations;
    unitPrice: number;
  }[];
  paymentMethod: "cod" | "qr";
  notes?: string;
  shippingMethod: string;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

export interface GlobalSettings {
  _id?: string;
  siteName: string;
  logo?: string;
  announcementText?: string;
  whatsappNumber: string;
  contactEmail?: string;
  socialInstagram?: string;
  socialFacebook?: string;
}

export interface HeroData {
  _id?: string;
  title: string;
  subtitle: string;
  mainImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}
