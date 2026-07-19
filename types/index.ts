export interface ProductOptionValue {
  name: string;
  value?: string;
  priceImpact?: number;
  hexColor?: string;
  swatchImage?: string;
  previewImage?: string;
  displayOrder?: number;
  availability?: boolean;
}

export interface ProductOptionGroup {
  name: string; // e.g. "Bouquet Size", "Flower Color", "Wrapper Style"
  type: "size" | "color" | "wrapper" | "radio" | "select";
  required?: boolean;
  options: ProductOptionValue[];
}

export interface GalleryGroup {
  title: string;
  optionValue: string; // Value linking to size option, e.g. "5-roses" or "5 Roses"
  images: string[];
  defaultImage?: string;
  displayOrder?: number;
}

export interface Addon {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  icon?: string;
  previewImage?: string;
  category?: string;
  availability?: boolean;
  displayOrder?: number;
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
  images: string[];
  category: {
    title: string;
    slug: string;
  };
  collections?: string[];
  availability: boolean;
  featured?: boolean;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  
  // Customization & Gallery Architecture
  galleryGroups?: GalleryGroup[];
  optionGroups?: ProductOptionGroup[];
  addons?: Addon[];
  
  // Backward Compatibility
  variants?: any[];
  hasGlitterOption?: boolean;
  hasSnowPaperOption?: boolean;
  hasGiftNoteOption?: boolean;
  deliveryInfo?: string;
}

export interface CartCustomizations {
  selectedOptions?: Record<string, string>;
  selectedAddons?: string[];
  flowerColor?: string;
  ribbonColor?: string;
  addGlitter?: boolean;
  addSnowPaper?: boolean;
  giftNote?: string;
  customizedText?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customizations: CartCustomizations;
  unitPrice: number;
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
  paymentMethod?: string;
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
