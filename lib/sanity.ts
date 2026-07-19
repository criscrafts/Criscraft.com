import { createClient } from "next-sanity";
import { Product, Category, Testimonial, FAQItem, GlobalSettings, HeroData, Addon } from "@/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-03-11";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

// Reusable Add-on documents catalog
const MOCK_ADDONS: Addon[] = [
  {
    _id: "addon-glitter",
    name: "Spray Sparkly Glitter Dust",
    slug: "glitter-dust",
    price: 50,
    description: "Fine glass-shimmer dust sprayed lightly across rose petals for a dreamy sparkle.",
    icon: "sparkles",
    category: "embellishment",
    availability: true,
  },
  {
    _id: "addon-snowpaper",
    name: "Textured White Snow Paper Wrap",
    slug: "snow-paper",
    price: 100,
    description: "Structured, snow-embossed Japanese craft wrapping paper tied with cotton thread.",
    icon: "snow",
    category: "wrapper",
    availability: true,
  },
  {
    _id: "addon-[#pearls]",
    name: "Dainty Pearl Blossom Pins",
    slug: "pearl-pins",
    price: 150,
    description: "Hand-inserted faux pearl pins nestled inside petal centers.",
    icon: "gem",
    category: "embellishment",
    availability: true,
  },
  {
    _id: "addon-lights",
    name: "Warm LED Fairy Lights Woven",
    slug: "led-lights",
    price: 250,
    description: "Warm golden micro LED string lights with concealed battery toggle.",
    icon: "lights",
    category: "accessory",
    availability: true,
  },
  {
    _id: "addon-teddy",
    name: "Mini Plushie Bear Companion",
    slug: "mini-teddy",
    price: 350,
    description: "Soft plushie bear clip attached to the central ribbon bow.",
    icon: "teddy",
    category: "accessory",
    availability: true,
  },
];

// Curated high-end mock products representing the luxury CrisCrafts catalogue
const MOCK_PRODUCTS: Product[] = [
  {
    _id: "mock-1",
    title: "Elysian Rose Ribbon Bouquet",
    slug: "elysian-rose-ribbon-bouquet",
    price: 1850,
    discountPrice: 1650,
    description: "Indulge in eternal beauty with our signature Elysian Ribbon Bouquet. Individually shaped satin ribbons are assembled loop by loop by master artisans. Choose your preferred bouquet size, rose petal colors, luxury wrappers, and add-ons to create a bespoke masterpiece that never fades.",
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Ribbon Bouquets", slug: "ribbon-bouquets" },
    collections: ["anniversary-gifts", "valentines-collection"],
    availability: true,
    tags: ["Best Seller", "Handcrafted", "Eternal"],
    rating: 4.9,
    reviewsCount: 34,
    hasGiftNoteOption: true,
    deliveryInfo: "Handcrafted to order. Ships in 3-5 business days across Nepal.",
    
    // Customization Groups Architecture
    optionGroups: [
      {
        name: "Choose Bouquet Size",
        type: "size",
        required: true,
        options: [
          { name: "Single Rose", value: "single-rose", priceImpact: 0 },
          { name: "3 Roses Bouquet", value: "3-roses", priceImpact: 600 },
          { name: "5 Roses Bouquet", value: "5-roses", priceImpact: 1200 },
          { name: "7 Roses Bouquet", value: "7-roses", priceImpact: 1800 },
          { name: "20 Roses Luxury Edition", value: "20-roses", priceImpact: 4800 }
        ]
      },
      {
        name: "Choose Flower Color",
        type: "color",
        required: true,
        options: [
          { name: "Muted Blush Pink", value: "blush-pink", hexColor: "#F28F9E", priceImpact: 0, previewImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80" },
          { name: "Vintage Champagne Gold", value: "champagne", hexColor: "#D4B26F", priceImpact: 0, previewImage: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80" },
          { name: "Deep Royal Crimson", value: "crimson", hexColor: "#991B1B", priceImpact: 100, previewImage: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=80" },
          { name: "Soft Lavender Violet", value: "lavender", hexColor: "#C084FC", priceImpact: 0, previewImage: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80" },
          { name: "Pure Ivory Snow", value: "ivory-white", hexColor: "#FAF9F6", priceImpact: 0 }
        ]
      },
      {
        name: "Choose Wrapper",
        type: "wrapper",
        required: true,
        options: [
          { name: "Classic Cream Parchment", value: "cream-parchment", hexColor: "#F9F6F0", priceImpact: 0 },
          { name: "Textured White Snow Paper", value: "snow-paper", hexColor: "#FFFFFF", priceImpact: 100 },
          { name: "Matte Midnight Slate", value: "midnight-slate", hexColor: "#1E293B", priceImpact: 50 },
          { name: "Organza Gold Lace Trim", value: "organza-gold", hexColor: "#EBF3F5", priceImpact: 150 }
        ]
      }
    ],

    // Gallery Groups Linked to Bouquet Size
    galleryGroups: [
      {
        title: "Single Rose Showcase",
        optionValue: "single-rose",
        images: [
          "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        title: "3 Roses Bouquet Gallery",
        optionValue: "3-roses",
        images: [
          "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        title: "5 Roses Collection Gallery",
        optionValue: "5-roses",
        images: [
          "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        title: "7 Roses Bouquet Gallery",
        optionValue: "7-roses",
        images: [
          "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        title: "20 Roses Grand Edition",
        optionValue: "20-roses",
        images: [
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],

    // Reusable Add-ons
    addons: MOCK_ADDONS,

    reviews: [
      { id: "r1", author: "Aria K.", rating: 5, date: "2026-06-15", text: "The craftsmanship is stunning. My mother was teary-eyed when she saw the custom rose colors and gift note." },
      { id: "r2", author: "Devin S.", rating: 5, date: "2026-07-02", text: "Exceptional quality. Selecting the 5 Roses gallery gave me total confidence in how the final piece looks!" }
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
    hasGiftNoteOption: true,
    optionGroups: [
      {
        name: "Choose Petal Color",
        type: "color",
        required: true,
        options: [
          { name: "Blush Rose", value: "blush-rose", hexColor: "#F28F9E", priceImpact: 0 },
          { name: "Warm Gold Yellow", value: "gold-yellow", hexColor: "#D4B26F", priceImpact: 0 },
          { name: "Dusty Lavender", value: "dusty-lavender", hexColor: "#C084FC", priceImpact: 50 }
        ]
      }
    ],
    addons: [MOCK_ADDONS[0], MOCK_ADDONS[3]]
  },
  {
    _id: "mock-3",
    title: "Artisan Plushie: Clover the Bunny",
    slug: "clover-the-bunny-plushie",
    price: 3200,
    description: "Clover is a luxury crochet plushie handcrafted with hypoallergenic soft-spun milk cotton yarn. Every loop is tight, ensuring a lifetime of warm hugs.",
    images: [
      "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Crochet Plushies", slug: "crochet-plushies" },
    collections: ["surprise-boxes", "handmade-gifts"],
    availability: true,
    tags: ["Customizable", "Soft Yarn"],
    rating: 5.0,
    reviewsCount: 19,
    hasGiftNoteOption: true,
    optionGroups: [
      {
        name: "Plushie Size",
        type: "size",
        required: true,
        options: [
          { name: "Mini Desk Companion (8 in)", value: "mini", priceImpact: 0 },
          { name: "Standard Huggable (14 in)", value: "standard", priceImpact: 800 }
        ]
      },
      {
        name: "Yarn Texture",
        type: "radio",
        required: true,
        options: [
          { name: "Super Soft Milk Cotton", value: "cotton", priceImpact: 0 },
          { name: "Fluffy Velvet Chenille", value: "velvet", priceImpact: 350 }
        ]
      }
    ],
    addons: [MOCK_ADDONS[3], MOCK_ADDONS[4]]
  },
  {
    _id: "mock-4",
    title: "Fuzzy Wire Meadow Keychain",
    slug: "fuzzy-wire-meadow-keychain",
    price: 450,
    description: "A whimsical keychain shaped from ultra-soft premium fuzzy wires. Features a tiny sunflower and lavender bundle.",
    images: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Fuzzy Wire Keychains", slug: "fuzzy-wire-keychains" },
    collections: ["birthday-gifts", "graduation-bouquets"],
    availability: true,
    tags: ["New", "Cute", "Daily Luxury"],
    rating: 4.7,
    reviewsCount: 12,
    hasGiftNoteOption: false,
    optionGroups: [
      {
        name: "Keyring Color",
        type: "color",
        required: true,
        options: [
          { name: "Rose Gold", value: "rose-gold", hexColor: "#B76E79", priceImpact: 0 },
          { name: "Vintage Brass", value: "vintage-brass", hexColor: "#D4B26F", priceImpact: 0 },
          { name: "Silver Chrome", value: "silver", hexColor: "#CBD5E1", priceImpact: 0 }
        ]
      }
    ],
    addons: [MOCK_ADDONS[0]]
  },
  {
    _id: "mock-5",
    title: "Midnight Grace Surprise Box",
    slug: "midnight-grace-surprise-box",
    price: 5400,
    discountPrice: 4900,
    description: "Unbox an opulent display of fuzzy wire lavender, crochet tulips, handcrafted chocolate truffles, and a custom wax-sealed card in a luxury presentation box.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Surprise Boxes", slug: "surprise-boxes" },
    collections: ["surprise-boxes", "valentines-collection", "anniversary-gifts"],
    availability: true,
    tags: ["Gift Box", "Premium Choice"],
    rating: 4.9,
    reviewsCount: 31,
    hasGiftNoteOption: true,
    optionGroups: [
      {
        name: "Occasion Theme",
        type: "radio",
        required: true,
        options: [
          { name: "Romantic Anniversary", value: "anniversary", priceImpact: 0 },
          { name: "Golden Birthday Celebration", value: "birthday", priceImpact: 100 },
          { name: "Graduation Honor", value: "graduation", priceImpact: 50 }
        ]
      }
    ],
    addons: MOCK_ADDONS
  },
  {
    _id: "mock-6",
    title: "Golden Aura Graduation Bouquet",
    slug: "golden-aura-graduation-bouquet",
    price: 3600,
    description: "Featuring gold fuzzy wire blossoms representing prosperity, combined with deep green cotton crochet leaves.",
    images: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80"
    ],
    category: { title: "Graduation Bouquets", slug: "graduation-bouquets" },
    collections: ["graduation-bouquets"],
    availability: true,
    tags: ["Graduation Exclusive", "Handcrafted"],
    rating: 4.9,
    reviewsCount: 16,
    hasGiftNoteOption: true,
    addons: [MOCK_ADDONS[0], MOCK_ADDONS[1], MOCK_ADDONS[3]]
  }
];

const MOCK_CATEGORIES: Category[] = [
  { _id: "cat-1", title: "Ribbon Bouquets", slug: "ribbon-bouquets", description: "Elegant, satin-shimmer bouquets styled to last a lifetime.", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-2", title: "Crochet Flowers", slug: "crochet-flowers", description: "Meticulously knitted standalone blooms made with soft organic cotton.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-3", title: "Crochet Plushies", slug: "crochet-plushies", description: "Adorable soft-spun companions crafted loop by loop.", image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-4", title: "Fuzzy Wire Keychains", slug: "fuzzy-wire-keychains", description: "Dainty key accessories shaped from plush wire clusters.", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-5", title: "Surprise Boxes", slug: "surprise-boxes", description: "Curated artisan hampers paired with premium wraps and personal details.", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-6", title: "Graduation Bouquets", slug: "graduation-bouquets", description: "Golden wire stems and green knit foliage to commemorate success.", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80" }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { _id: "t1", author: "Elena Rostova", role: "Creative Director", text: "CrisCrafts is standard-setting. The texture of the clover plushie and the subtle gold stitching are exquisite. It feels like stepping into a boutique in Paris.", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
  { _id: "t2", author: "Kiran Shrestha", role: "Art Collector", text: "I bought the Elysian Rose Bouquet for our anniversary, and my wife was stunned. The choice of rose counts, satin ribbon, and snow paper wrapping was perfection.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
  { _id: "t3", author: "Sophia Martinez", role: "Lifestyle Designer", text: "The keychains and bouquets are tiny works of art. Highly recommend adding LED lights and the gift card note. Arrived packaged like royalty.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" }
];

const MOCK_FAQS: FAQItem[] = [
  { _id: "f1", question: "How long does it take to make a custom order?", answer: "Each item is crafted entirely by hand. Standard orders ship in 3-5 business days. Highly customized bouquets or bulk order boxes may require 7-10 days.", category: "Orders" },
  { _id: "f2", question: "Do you ship internationally?", answer: "We currently provide express shipping nationwide in Nepal. International delivery can be arranged through our WhatsApp desk.", category: "Shipping" },
  { _id: "f3", question: "What materials do you use?", answer: "We select organic milk cotton yarn, soft fuzzy wires, hypoallergenic stuffing, and heavy double-sided satin ribbons to ensure a luxury tactile experience.", category: "Materials" },
  { _id: "f4", question: "How does gallery group switching work?", answer: "When you select different rose counts or bouquet sizes on a product page, the gallery group automatically switches to display professional photos of that exact size!", category: "Product Configurator" }
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
    const query = `*[_type == "product" && !(_id in path("drafts.**")) && (availability == true || !defined(availability))] {
      _id,
      title,
      "slug": slug.current,
      price,
      discountPrice,
      description,
      "images": coalesce(images[].asset->url, images),
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
      deliveryInfo,
      galleryGroups[] {
        title,
        optionValue,
        "images": coalesce(images[].asset->url, images),
        "defaultImage": defaultImage.asset->url
      },
      optionGroups[] {
        name,
        type,
        required,
        options[] {
          name,
          value,
          priceImpact,
          hexColor,
          "swatchImage": swatchImage.asset->url,
          "previewImage": previewImage.asset->url,
          availability
        }
      },
      addons[]->{
        _id,
        name,
        "slug": slug.current,
        price,
        description,
        icon,
        "previewImage": previewImage.asset->url,
        category,
        availability
      }
    }`;
    const data = await sanityClient.fetch(query);
    if (!data || data.length === 0) {
      console.warn("Empty products returned from Sanity. Using fallback mock products.");
      return MOCK_PRODUCTS;
    }
    const uniqueProducts = Array.from(
      new Map(data.map((item: any) => [item.slug || item._id, item])).values()
    ) as Product[];

    return uniqueProducts;
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
    const query = `*[_type == "product" && !(_id in path("drafts.**")) && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      price,
      discountPrice,
      description,
      "images": coalesce(images[].asset->url, images),
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
      deliveryInfo,
      galleryGroups[] {
        title,
        optionValue,
        "images": coalesce(images[].asset->url, images),
        "defaultImage": defaultImage.asset->url
      },
      optionGroups[] {
        name,
        type,
        required,
        options[] {
          name,
          value,
          priceImpact,
          hexColor,
          "swatchImage": swatchImage.asset->url,
          "previewImage": previewImage.asset->url,
          availability
        }
      },
      addons[]->{
        _id,
        name,
        "slug": slug.current,
        price,
        description,
        icon,
        "previewImage": previewImage.asset->url,
        category,
        availability
      },
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
    const query = `*[_type == "category" && !(_id in path("drafts.**"))] {
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
    const query = `*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0..5] {
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
    const query = `*[_type == "faq" && !(_id in path("drafts.**"))] {
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
    const query = `*[_type == "settings" && !(_id in path("drafts.**"))][0] {
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
    const query = `*[_type == "homepageHero" && !(_id in path("drafts.**"))][0] {
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
