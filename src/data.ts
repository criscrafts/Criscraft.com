import { Product, OccasionTheme } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-eternal-blossom',
    name: 'Eternal Blossom Ribbon Bouquet',
    description: 'Bespoke hand-folded premium satin ribbon roses styled with whimsical filler stems and clean parchment paper wraps. It never fades, representing eternal warmth.',
    category: 'Bouquet',
    material: 'Ribbon',
    basePrice: 850,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    popular: true,
    options: [
      { id: 'opt-wrap-blue', name: 'Wrapping: Sky Blue Wrap', priceDelta: 0 },
      { id: 'opt-wrap-pink', name: 'Wrapping: Dreamy Blush Pink', priceDelta: 0 },
      { id: 'opt-wrap-vintage', name: 'Wrapping: Kraft Paper Lettering', priceDelta: 0 },
      { id: 'opt-fuzz-wire', name: 'Accent: Add Fuzzy Wire Stems', priceDelta: 150 },
      { id: 'opt-kitkat', name: 'Bounty: Add KitKat Wafers', priceDelta: 80 },
      { id: 'opt-ferrero', name: 'Bounty: Add Ferrero Rocher (x3)', priceDelta: 120 }
    ]
  },
  {
    id: 'prod-fuzzy-cloud',
    name: 'Whispering Cloud Fuzzy-Wire Bouquet',
    description: 'An extremely soft, fluffy lavender and teal aesthetic bouquet crafted from high-density fuzzy chenille stems. Whimsically shaped like starry tulips and cloud puffs.',
    category: 'Bouquet',
    material: 'Fuzzy Wire',
    basePrice: 1150,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    popular: true,
    options: [
      { id: 'opt-cloud-std', name: 'Accent: Celestial Star Stems', priceDelta: 0 },
      { id: 'opt-cloud-lav', name: 'Detail: Glow-in-the-dark Dewdrops', priceDelta: 100 },
      { id: 'opt-cloud-ribbon', name: 'Lace: Velvet Ribbon Bow tie', priceDelta: 50 },
      { id: 'opt-snickers', name: 'Bounty: Add Snickers Mini', priceDelta: 70 },
      { id: 'opt-ferrero-cloud', name: 'Bounty: Add Ferrero Rocher (x3)', priceDelta: 120 }
    ]
  },
  {
    id: 'prod-sweet-romance',
    name: 'Gourmet Chocolate Cascades Bouquet',
    description: 'The ultimate sweet gesture. A towering display of chocolate bars intertwined with handcrafted ribbon baby-breaths and a secure heavy luxury base fold.',
    category: 'Bouquet',
    material: 'Chocolates',
    basePrice: 1450,
    image: 'https://images.unsplash.com/photo-1549007994-cb92ca8a3a77?q=80&w=600&auto=format&fit=crop',
    rating: 5.0,
    popular: false,
    options: [
      { id: 'opt-choc-std', name: 'Selection: Dairy Milk Assortment', priceDelta: 0 },
      { id: 'opt-choc-premium', name: 'Selection: Premium Cadbury & KitKat', priceDelta: 180 },
      { id: 'opt-choc-gold', name: 'Selection: Ferrero Golden Feast', priceDelta: 300 },
      { id: 'opt-choc-fuzz', name: 'Accent: Incorporate Fuzzy Tulips', priceDelta: 150 }
    ]
  },
  {
    id: 'prod-anime-chibi',
    name: 'Celestial Chibi Anime Keyring',
    description: 'Intricately threaded characters and custom elements customized on a premium metal connector. Features high-grade hardware, hand-tied ribbon attachments and matching colors.',
    category: 'Keyring',
    material: 'Ribbon',
    basePrice: 250,
    image: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    popular: true,
    options: [
      { id: 'opt-key-std', name: 'Ring: Stainless Lobster Clasp', priceDelta: 0 },
      { id: 'opt-key-bow', name: 'Charm: Pastel Velvet Bow Tie', priceDelta: 40 },
      { id: 'opt-key-fuzz', name: 'Charm: Fluffy Chenille Pom-Pom', priceDelta: 60 },
      { id: 'opt-key-bell', name: 'Charm: Tiny Brass Sounding Bell', priceDelta: 30 }
    ]
  },
  {
    id: 'prod-fuzzy-puppy',
    name: 'Kawaii Fuzzy-wire Teddy Pendant',
    description: 'Ultra-cute companion charm sculpted manually from dense velvet chenille. Comes attached to a premium bead-chain connector.',
    category: 'Keyring',
    material: 'Fuzzy Wire',
    basePrice: 290,
    image: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    popular: false,
    options: [
      { id: 'opt-teddy-std', name: 'Color: Butterscotch Caramel', priceDelta: 0 },
      { id: 'opt-teddy-cream', name: 'Color: Vanilla cream fluff', priceDelta: 0 },
      { id: 'opt-teddy-bow', name: 'Detail: Ribbon Collar with Bell', priceDelta: 50 },
      { id: 'opt-teddy-bead', name: 'Chains: Luxury Pastel Pearl Ring', priceDelta: 70 }
    ]
  },
  {
    id: 'prod-royal-velvet',
    name: 'Midnight Scarlet Ribbon Bouquet',
    description: 'Breathtaking heavy wrapping styled in gothic black and crimson hand-sewn satin roses. Radiates high-drama sophistication.',
    category: 'Bouquet',
    material: 'Ribbon',
    basePrice: 1800,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    popular: false,
    options: [
      { id: 'opt-royal-wrap', name: 'Wrap: Onyx Velvet Crafting', priceDelta: 0 },
      { id: 'opt-royal-lace', name: 'Border: French Chantilly Lace Lace', priceDelta: 120 },
      { id: 'opt-royal-gem', name: 'Glamour: Sparkling Crown Tiara Pin', priceDelta: 250 },
      { id: 'opt-royal-ferrero', name: 'Sweetener: Truffle Basket additions', priceDelta: 150 }
    ]
  }
];

export const OCCASION_THEMES: OccasionTheme[] = [
  {
    id: 'thm-sky',
    label: 'Standard',
    eventName: 'Everyday Joy',
    tint: 'from-sky-50 via-sky-100/50 to-blue-50/20',
    accentBg: 'bg-brand-primary',
    glassStyle: 'glass-panel',
    tagline: 'Delightfully handcrafted, happily delivered.',
    tagColor: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
  },
  {
    id: 'thm-mothers',
    label: 'Mother\'s Day Tribute',
    eventName: 'Mother\'s Day Special',
    tint: 'from-pink-50 via-rose-50 to-sky-100/30',
    accentBg: 'bg-rose-400',
    glassStyle: 'pink-glass-panel',
    tagline: 'Say "Thank you, Mom" with blushing ribbon roses & sweet custom chocolates.',
    tagColor: 'bg-rose-500/10 text-rose-600 border-rose-200'
  },
  {
    id: 'thm-fathers',
    label: 'Father\'s Day Special',
    eventName: 'Father\'s Day Season',
    tint: 'from-slate-900 via-sky-950 to-indigo-950',
    accentBg: 'bg-sky-500',
    glassStyle: 'dark-glass-panel',
    tagline: 'Bold velvet wraps & customized keyrings to appreciate the superhero of your life!',
    tagColor: 'bg-sky-400/10 text-sky-300 border-sky-800'
  }
];
