import { createClient } from "next-sanity";
import { Product, Category, Testimonial, FAQItem, GlobalSettings, HeroData } from "@/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-03-11";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN, // token for writing data or secure fetches
});

// A curated set of high-end premium mock products representing the luxury CrisCrafts catalogue
const MOCK_PRODUCTS: Product[] = [
  {
    _id: "mock-1",
    title: "Elysian Rose Ribbon Bouquet",
    slug: "elysian-rose-ribbon-bouquet",
    price: 2450,
    discountPrice: 2100,
    description: "Indulge in eternal beauty with our signature Elysian Ribbon Bouquet. Individually shaped satin ribbons are assembled by hand to create a breathtaking bouquet that never fades. Embellished with delicate glitter accents and wrapped in organic snow paper, this piece tells a story of enduring affection.",
    images: [
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Ribbon Bouquets", slug: "ribbon-bouquets" },
    collections: ["anniversary-gifts", "valentines-collection"],
    availability: true,
    tags: ["Best Seller", "Handcrafted", "Eternal"],
    rating: 4.9,
    reviewsCount: 28,
    hasGlitterOption: true,
    hasSnowPaperOption: true,
    hasGiftNoteOption: true,
    variants: [
      {
        name: "Flower Color",
        required: true,
        options: [
          { name: "Muted Blush Pink", priceImpact: 0 },
          { name: "Vintage Champagne", priceImpact: 0 },
          { name: "Deep Crimson", priceImpact: 100 },
          { name: "Soft Lavender", priceImpact: 0 }
        ]
      },
      {
        name: "Ribbon Style",
        required: true,
        options: [
          { name: "Satin Pink Ribbon", priceImpact: 0 },
          { name: "Gold Edged Organza", priceImpact: 150 },
          { name: "Minimalist Ivory Cotton", priceImpact: 50 }
        ]
      }
    ],
    reviews: [
      { id: "r1", author: "Aria K.", rating: 5, date: "2026-06-15", text: "The craftsmanship is absolutely stunning. My mother was teary-eyed when she saw the custom details on the ribbon bouquet." },
      { id: "r2", author: "Devin S.", rating: 5, date: "2026-07-02", text: "Exceptional quality. Far better than any real flower bouquet that would wither in days. The gold-edged ribbon option is a must!" }
    ]
  },
  {
    _id: "mock-2",
    title: "La Petit Rose Crochet Flower",
    slug: "la-petit-rose-crochet-flower",
    price: 850,
    description: "A single, exquisitely knitted crochet rose, presented in a minimal glass vial container. Perfect as a desk companion or a subtle token of appreciation. Handcrafted with high-quality organic cotton yarn for an organic, soft touch.",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Crochet Flowers", slug: "crochet-flowers" },
    collections: ["birthday-gifts", "handmade-gifts"],
    availability: true,
    tags: ["Minimalist", "Desk Decor"],
    rating: 4.8,
    reviewsCount: 14,
    hasGlitterOption: false,
    hasSnowPaperOption: false,
    hasGiftNoteOption: true,
    variants: [
      {
        name: "Petal Color",
        required: true,
        options: [
          { name: "Blush Rose", priceImpact: 0 },
          { name: "Warm Gold Yellow", priceImpact: 0 },
          { name: "Dusty Blue", priceImpact: 50 }
        ]
      }
    ]
  },
  {
    _id: "mock-3",
    title: "Artisan Plushie: Clover the Bunny",
    slug: "clover-the-bunny-plushie",
    price: 3200,
    description: "Clover is a luxury crochet plushie handcrafted with hypoallergenic soft-spun milk cotton yarn. Every loop is tight, ensuring a lifetime of warm hugs. Featuring custom-embroidered initials on the footpad for the ultimate bespoke gifting experience.",
    images: [
      "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Crochet Plushies", slug: "crochet-plushies" },
    collections: ["surprise-boxes", "handmade-gifts"],
    availability: true,
    tags: ["Customizable", "Soft Yarn"],
    rating: 5.0,
    reviewsCount: 19,
    hasGlitterOption: false,
    hasSnowPaperOption: false,
    hasGiftNoteOption: true,
    variants: [
      {
        name: "Yarn Texture",
        required: true,
        options: [
          { name: "Super Soft Milk Cotton", priceImpact: 0 },
          { name: "Fluffy Velvet Chenille", priceImpact: 350 }
        ]
      }
    ]
  },
  {
    _id: "mock-4",
    title: "Fuzzy Wire Meadow Keychain",
    slug: "fuzzy-wire-meadow-keychain",
    price: 450,
    description: "A whimsical keychain shaped from ultra-soft premium fuzzy wires. This micro-crafted accessory features a tiny sunflower and lavender bundle, carrying a gentle organic texture. Adds an instant, cheerful artisan aesthetic to keys or bags.",
    images: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Fuzzy Wire Keychains", slug: "fuzzy-wire-keychains" },
    collections: ["birthday-gifts", "graduation-bouquets"],
    availability: true,
    tags: ["New", "Cute", "Daily Luxury"],
    rating: 4.7,
    reviewsCount: 12,
    hasGlitterOption: true,
    hasSnowPaperOption: false,
    hasGiftNoteOption: false,
  },
  {
    _id: "mock-5",
    title: "Midnight Grace Surprise Box",
    slug: "midnight-grace-surprise-box",
    price: 5400,
    discountPrice: 4900,
    description: "The ultimate gifting gesture. Unbox an opulent display of fuzzy wire lavender, crochet tulips, handcrafted chocolate truffles, and a custom wax-sealed card. Neatly housed in a luxury cream presentation box with elegant gold leaf trim.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Surprise Boxes", slug: "surprise-boxes" },
    collections: ["surprise-boxes", "valentines-collection", "anniversary-gifts"],
    availability: true,
    tags: ["Gift Box", "Premium Choice"],
    rating: 4.9,
    reviewsCount: 31,
    hasGlitterOption: true,
    hasSnowPaperOption: true,
    hasGiftNoteOption: true,
    variants: [
      {
        name: "Occasion Theme",
        required: true,
        options: [
          { name: "Romantic Anniversary", priceImpact: 0 },
          { name: "Golden Birthday Celebration", priceImpact: 100 },
          { name: "Graduation Celebration", priceImpact: 50 }
        ]
      }
    ]
  },
  {
    _id: "mock-6",
    title: "Golden Aura Graduation Bouquet",
    slug: "golden-aura-graduation-bouquet",
    price: 3600,
    description: "Honor a momentous milestone with our handcrafted Graduation Bouquet. Featuring gold fuzzy wire blossoms representing prosperity, combined with deep green cotton crochet leaves. Wrapped in structured off-white parchment paper with premium black satin loops.",
    images: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Graduation Bouquets", slug: "graduation-bouquets" },
    collections: ["graduation-bouquets"],
    availability: true,
    tags: ["Graduation Exclusive", "Handcrafted"],
    rating: 4.9,
    reviewsCount: 16,
    hasGlitterOption: true,
    hasSnowPaperOption: true,
    hasGiftNoteOption: true,
  }
];

const MOCK_CATEGORIES: Category[] = [
  { _id: "cat-1", title: "Ribbon Bouquets", slug: "ribbon-bouquets", description: "Elegant, satin-shimmer bouquets styled to last a lifetime.", image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-2", title: "Crochet Flowers", slug: "crochet-flowers", description: "Meticulously knitted standalone blooms made with soft organic cotton.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-3", title: "Crochet Plushies", slug: "crochet-plushies", description: "Adorable soft-spun companions crafted loop by loop.", image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-4", title: "Fuzzy Wire Keychains", slug: "fuzzy-wire-keychains", description: "Dainty key accessories shaped from plush wire clusters.", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-5", title: "Surprise Boxes", slug: "surprise-boxes", description: "Curated artisan hampers paired with premium wraps and personal details.", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-6", title: "Graduation Bouquets", slug: "graduation-bouquets", description: "Golden wire stems and green knit foliage to commemorate success.", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80" }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { _id: "t1", author: "Elena Rostova", role: "Creative Director", text: "CrisCrafts is standard-setting. The texture of the clover plushie and the subtle gold stitching are exquisite. It feels like stepping into a boutique in Paris.", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
  { _id: "t2", author: "Kiran Shrestha", role: "Art Collector", text: "I bought the Elysian Rose Bouquet for our anniversary, and my wife was stunned. The choice of satin ribbon, the delicate wrapping—every detail whispers quality.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
  { _id: "t3", author: "Sophia Martinez", role: "Lifestyle Designer", text: "The keychains are tiny works of art. Highly recommend the gift packaging. The box arrived tied with cotton thread and sealed with real wax. Breathtaking.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" }
];

const MOCK_FAQS: FAQItem[] = [
  { _id: "f1", question: "How long does it take to make a custom order?", answer: "Each item is crafted entirely by hand. Standard orders ship in 3-5 business days. Highly customized bouquets or bulk order boxes may require 7-10 days. We always suggest placing anniversary or graduation orders 2 weeks in advance.", category: "Orders" },
  { _id: "f2", question: "Do you ship internationally?", answer: "We currently provide express shipping nationwide. International shipping can be arranged upon custom request through our WhatsApp line.", category: "Shipping" },
  { _id: "f3", question: "What materials do you use?", answer: "We select only the finest organic milk cotton yarn, soft premium fuzzy wires, hypoallergenic stuffing, and heavy double-sided satin ribbons to ensure a luxurious tactile experience.", category: "Materials" },
  { _id: "f4", question: "How does the WhatsApp checkout verification work?", answer: "After completing checkout on our website, a secure order ID is generated. Clicking 'Send WhatsApp Confirmation' opens a pre-composed message with your order details directly to our artisan team to finalize payment verification.", category: "Payment" }
];

// Helper to determine if Sanity is correctly set up
const isSanityConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder-id"
  );
};

// API Fetch Helpers with fallback handling
export async function getProducts(): Promise<Product[]> {
  if (!isSanityConfigured()) {
    return MOCK_PRODUCTS;
  }
  try {
    const query = `*[_type == "product" && availability == true] {
      _id,
      title,
      "slug": slug.current,
      price,
      discountPrice,
      description,
      "images": images[].asset->url,
      category->{
        title,
        "slug": slug.current
      },
      "collections": collections[]->slug.current,
      availability,
      featured,
      tags,
      rating,
      reviewsCount,
      hasGlitterOption,
      hasSnowPaperOption,
      hasGiftNoteOption,
      variants
    }`;
    const data = await sanityClient.fetch(query);
    if (!data || data.length === 0) {
      console.warn("Empty products returned from Sanity. Using fallback mock products.");
      return MOCK_PRODUCTS;
    }
    return data;
  } catch (error) {
    console.warn("Failed to fetch from Sanity CMS, using mock data fallbacks.", error);
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured()) {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  }
  try {
    const query = `*[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      price,
      discountPrice,
      description,
      "images": images[].asset->url,
      category->{
        title,
        "slug": slug.current
      },
      "collections": collections[]->slug.current,
      availability,
      featured,
      tags,
      rating,
      reviewsCount,
      hasGlitterOption,
      hasSnowPaperOption,
      hasGiftNoteOption,
      variants,
      reviews[] {
        id,
        author,
        rating,
        date,
        text
      }
    }`;
    const data = await sanityClient.fetch(query, { slug });
    if (!data) {
      console.warn(`Product slug not found in Sanity: ${slug}. Using mock fallback.`);
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }
    return data;
  } catch (error) {
    console.warn(`Failed to fetch product for slug: ${slug}, using fallback data.`, error);
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return product || null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured()) {
    return MOCK_CATEGORIES;
  }
  try {
    const query = `*[_type == "category"] {
      _id,
      title,
      "slug": slug.current,
      description,
      "image": image.asset->url
    }`;
    const data = await sanityClient.fetch(query);
    if (!data || data.length === 0) {
      console.warn("Empty categories returned from Sanity. Using fallback mock categories.");
      return MOCK_CATEGORIES;
    }
    return data;
  } catch (error) {
    console.warn("Failed to fetch categories from Sanity, using mock data.", error);
    return MOCK_CATEGORIES;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured()) {
    return MOCK_TESTIMONIALS;
  }
  try {
    const query = `*[_type == "testimonial"] | order(_createdAt desc)[0..5] {
      _id,
      author,
      role,
      text,
      rating,
      "avatar": avatar.asset->url
    }`;
    const data = await sanityClient.fetch(query);
    if (!data || data.length === 0) {
      console.warn("Empty testimonials returned from Sanity. Using fallback mock testimonials.");
      return MOCK_TESTIMONIALS;
    }
    return data;
  } catch (error) {
    console.warn("Failed to fetch testimonials from Sanity, using mock data.", error);
    return MOCK_TESTIMONIALS;
  }
}

export async function getFAQs(): Promise<FAQItem[]> {
  if (!isSanityConfigured()) {
    return MOCK_FAQS;
  }
  try {
    const query = `*[_type == "faq"] {
      _id,
      question,
      answer,
      category
    }`;
    const data = await sanityClient.fetch(query);
    if (!data || data.length === 0) {
      console.warn("Empty FAQs returned from Sanity. Using fallback mock FAQs.");
      return MOCK_FAQS;
    }
    return data;
  } catch (error) {
    console.warn("Failed to fetch FAQs from Sanity, using mock data.", error);
    return MOCK_FAQS;
  }
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  if (!isSanityConfigured()) {
    return null;
  }
  try {
    const query = `*[_type == "settings"][0] {
      siteName,
      "logo": logo.asset->url,
      announcementText,
      whatsappNumber,
      contactEmail,
      socialInstagram,
      socialFacebook
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.warn("Failed to fetch global settings from Sanity.", error);
    return null;
  }
}

export async function getHeroData(): Promise<HeroData | null> {
  if (!isSanityConfigured()) {
    return null;
  }
  try {
    const query = `*[_type == "homepageHero"][0] {
      title,
      subtitle,
      "mainImage": mainImage.asset->url,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink
    }`;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.warn("Failed to fetch homepage hero data from Sanity.", error);
    return null;
  }
}
