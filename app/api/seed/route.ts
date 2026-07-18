import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

// Define TypeScript interfaces for our data mappings
interface MockCategory {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
}

interface MockProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  category: { title: string; slug: string };
  collections: string[];
  availability: boolean;
  tags: string[];
  rating: number;
  reviewsCount: number;
  hasGlitterOption?: boolean;
  hasSnowPaperOption?: boolean;
  hasGiftNoteOption?: boolean;
  variants?: any[];
}

interface MockTestimonial {
  _id: string;
  author: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

interface MockFAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

// Mock Data definitions to insert
const MOCK_CATEGORIES: MockCategory[] = [
  { _id: "cat-1", title: "Ribbon Bouquets", slug: "ribbon-bouquets", description: "Elegant, satin-shimmer bouquets styled to last a lifetime.", image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-2", title: "Crochet Flowers", slug: "crochet-flowers", description: "Meticulously knitted standalone blooms made with soft organic cotton.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-3", title: "Crochet Plushies", slug: "crochet-plushies", description: "Adorable soft-spun companions crafted loop by loop.", image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-4", title: "Fuzzy Wire Keychains", slug: "fuzzy-wire-keychains", description: "Dainty key accessories shaped from plush wire clusters.", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-5", title: "Surprise Boxes", slug: "surprise-boxes", description: "Curated artisan hampers paired with premium wraps and personal details.", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-6", title: "Graduation Bouquets", slug: "graduation-bouquets", description: "Golden wire stems and green knit foliage to commemorate success.", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80" }
];

const MOCK_PRODUCTS: MockProduct[] = [
  {
    _id: "mock-1",
    title: "Elysian Rose Ribbon Bouquet",
    slug: "elysian-rose-ribbon-bouquet",
    price: 2450,
    discountPrice: 2100,
    description: "Indulge in eternal beauty with our signature Elysian Ribbon Bouquet. Handcrafted satin ribbons are individually shaped and assembled to create a breathtaking bouquet that never fades. Embellished with delicate glitter accents and wrapped in organic snow paper.",
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
    hasGiftNoteOption: false
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
    description: "Honor a momentous milestone with our handcrafted Graduation Bouquet. Featuring gold fuzzy wire blossoms representing prosperity, combined with deep green cotton crochet leaves. Wrapped in structured off-white parchment paper.",
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
    hasGiftNoteOption: true
  }
];

const MOCK_TESTIMONIALS: MockTestimonial[] = [
  { _id: "t-1", author: "Elena Rostova", role: "Creative Director", text: "CrisCrafts is standard-setting. The texture of the clover plushie and the subtle gold stitching are exquisite. It feels like stepping into a boutique in Paris.", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
  { _id: "t-2", author: "Kiran Shrestha", role: "Art Collector", text: "I bought the Elysian Rose Bouquet for our anniversary, and my wife was stunned. The choice of satin ribbon, the delicate wrapping—every detail whispers quality.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
  { _id: "t-3", author: "Sophia Martinez", role: "Lifestyle Designer", text: "The keychains are tiny works of art. Highly recommend the gift packaging. The box arrived tied with cotton thread and sealed with real wax. Breathtaking.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" }
];

const MOCK_FAQS: MockFAQ[] = [
  { _id: "f-1", question: "How long does it take to make a custom order?", answer: "Each item is crafted entirely by hand. Standard orders ship in 3-5 business days. Highly customized bouquets or bulk order boxes may require 7-10 days. We always suggest placing anniversary or graduation orders 2 weeks in advance.", category: "Orders" },
  { _id: "f-2", question: "Do you ship internationally?", answer: "We currently provide express shipping nationwide. International shipping can be arranged upon custom request through our WhatsApp line.", category: "Shipping" },
  { _id: "f-3", question: "What materials do you use?", answer: "We select only the finest organic milk cotton yarn, soft premium fuzzy wires, hypoallergenic stuffing, and heavy double-sided satin ribbons to ensure a luxurious tactile experience.", category: "Materials" },
  { _id: "f-4", question: "How does the WhatsApp checkout verification work?", answer: "After completing checkout on our website, a secure order ID is generated. Clicking 'Send WhatsApp Confirmation' opens a pre-composed message with your order details directly to our artisan team to finalize payment verification.", category: "Payment" }
];

// Helper: Download a remote image and upload it to Sanity as an asset
async function uploadImageFromUrl(url: string): Promise<any> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload image to Sanity asset pipeline
    const asset = await sanityClient.assets.upload("image", buffer, {
      filename: url.split("/").pop() || "image.jpg",
    });
    
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error(`Failed to seed image from URL: ${url}`, err);
    return null;
  }
}

export async function GET() {
  try {
    const logs: string[] = [];

    // 1. Seed Global Settings
    logs.push("Seeding Global Settings...");
    await sanityClient.createOrReplace({
      _id: "settings",
      _type: "settings",
      siteName: "CrisCrafts",
      announcementText: "✨ Free shipping inside Kathmandu valley! • Handcrafted with love",
      whatsappNumber: "+9779804276951",
      contactEmail: "hello@criscrafts.com",
      socialInstagram: "https://instagram.com/criscrafts",
      socialFacebook: "https://facebook.com/criscrafts",
    });
    logs.push("Global Settings seeded successfully.");

    // 2. Seed Homepage Hero Configuration
    logs.push("Seeding Homepage Hero...");
    await sanityClient.createOrReplace({
      _id: "homepageHero",
      _type: "homepageHero",
      title: "Crafting stories,<br />one <span class=\"font-serif italic text-soft-gold\">handmade</span> detail<br class=\"hidden sm:inline\" />at a time.",
      subtitle: "✨ Heart-led, hand-finished, and uniquely yours. Step into a world of premium artisan gift-giving where every stitch, ribbon, and fold is woven with absolute love.",
      primaryButtonText: "Explore Collection",
      primaryButtonLink: "/shop",
      secondaryButtonText: "Our Story",
      secondaryButtonLink: "/#our-story",
      mainImage: await uploadImageFromUrl("https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1000&q=80")
    });
    logs.push("Homepage Hero seeded successfully.");

    // 3. Seed Collections
    logs.push("Seeding Collections...");
    const collectionIds = [
      "anniversary-gifts",
      "valentines-collection",
      "birthday-gifts",
      "handmade-gifts",
      "surprise-boxes",
      "graduation-bouquets"
    ];
    for (const slug of collectionIds) {
      const title = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      await sanityClient.createOrReplace({
        _id: `collection-${slug}`,
        _type: "collection",
        title,
        slug: { _type: "slug", current: slug },
        description: `Curated selection of items for ${title}.`
      });
    }
    logs.push(`Seeded ${collectionIds.length} collections.`);

    // 4. Seed Categories
    logs.push("Seeding Categories...");
    const categoryMap: { [key: string]: string } = {};
    for (const cat of MOCK_CATEGORIES) {
      const imageAsset = await uploadImageFromUrl(cat.image);
      const doc = await sanityClient.createOrReplace({
        _id: `category-${cat.slug}`,
        _type: "category",
        title: cat.title,
        slug: { _type: "slug", current: cat.slug },
        description: cat.description,
        image: imageAsset || undefined
      });
      categoryMap[cat.slug] = doc._id;
    }
    logs.push(`Seeded ${MOCK_CATEGORIES.length} categories.`);

    // 5. Seed Products
    logs.push("Seeding Products...");
    let productIndex = 0;
    for (const prod of MOCK_PRODUCTS) {
      // Upload images
      const imageAssets = [];
      for (const imgUrl of prod.images) {
        const asset = await uploadImageFromUrl(imgUrl);
        if (asset) imageAssets.push(asset);
      }

      // Resolve category reference
      const catRef = categoryMap[prod.category.slug] ? {
        _type: "reference",
        _ref: categoryMap[prod.category.slug]
      } : undefined;

      // Resolve collections references
      const collectionRefs = prod.collections.map(colSlug => ({
        _type: "reference",
        _ref: `collection-${colSlug}`,
        _key: colSlug
      }));

      // Map variants structure
      const variants = prod.variants?.map(v => ({
        _type: "variant",
        _key: v.name.toLowerCase().replace(/\s/g, "-"),
        name: v.name,
        required: v.required,
        options: v.options.map((opt: any) => ({
          _type: "object",
          _key: opt.name.toLowerCase().replace(/\s/g, "-"),
          name: opt.name,
          priceImpact: opt.priceImpact
        }))
      })) || [];

      // Determine featured flag (flag first 3 items)
      const isFeatured = productIndex < 3;
      productIndex++;

      await sanityClient.createOrReplace({
        _id: `product-${prod.slug}`,
        _type: "product",
        title: prod.title,
        slug: { _type: "slug", current: prod.slug },
        price: prod.price,
        discountPrice: prod.discountPrice,
        description: prod.description,
        images: imageAssets,
        category: catRef,
        collections: collectionRefs,
        availability: prod.availability,
        featured: isFeatured,
        tags: prod.tags,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        hasGlitterOption: prod.hasGlitterOption || false,
        hasSnowPaperOption: prod.hasSnowPaperOption || false,
        hasGiftNoteOption: prod.hasGiftNoteOption || false,
        variants: variants
      });
    }
    logs.push(`Seeded ${MOCK_PRODUCTS.length} products.`);

    // 6. Seed Testimonials
    logs.push("Seeding Testimonials...");
    for (const t of MOCK_TESTIMONIALS) {
      const avatarAsset = await uploadImageFromUrl(t.avatar);
      await sanityClient.createOrReplace({
        _id: t._id,
        _type: "testimonial",
        author: t.author,
        role: t.role,
        text: t.text,
        rating: t.rating,
        avatar: avatarAsset || undefined
      });
    }
    logs.push(`Seeded ${MOCK_TESTIMONIALS.length} testimonials.`);

    // 7. Seed FAQs
    logs.push("Seeding FAQs...");
    for (const faq of MOCK_FAQS) {
      await sanityClient.createOrReplace({
        _id: faq._id,
        _type: "faq",
        question: faq.question,
        answer: faq.answer,
        category: faq.category
      });
    }
    logs.push(`Seeded ${MOCK_FAQS.length} FAQs.`);

    return NextResponse.json({
      success: true,
      message: "Sanity Studio database seeded successfully!",
      logs: logs
    });
  } catch (error: any) {
    console.error("Database seeding api route encountered an error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || error.toString(),
      stack: error.stack
    }, { status: 500 });
  }
}
