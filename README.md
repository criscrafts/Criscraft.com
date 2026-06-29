<div align="center">
<img width="1200" height="475" alt="CrisCrafts Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🌸 CrisCrafts Handcrafted Gift Shop

A high-end, responsive online boutique featuring premium handcrafted ribbon/fuzzy-wire bouquets, gourmet chocolate bouquets, and bespoke keyrings, powered by a deep-linked WhatsApp checkout system.

## 🚀 Key Features

- **Premium Handcrafted Catalog:** Browse and filter items such as satin ribbon bouquets, chenille fuzzy-wire creations, gourmet chocolate baskets, and kawaii customized keyrings.
- **Dynamic Occasion Themes:** Seamlessly switch between different occasion contexts (e.g., Mother's Day, Father's Day, and Everyday Joy) to update backgrounds, gradients, interactive tags, and custom occasion prompts.
- **Deep Customization Interface:** Select customized wraps, accents, lace attachments, and sweet treats with real-time price updates before purchase.
- **Interactive Shopping Basket:** A persistent and fully reactive shopping cart storing selections in local storage.
- **Integrated Checkout Pipeline:** Supports **Fonepay QR** and **Cash on Delivery (COD)** checkout routes, generating professional invoices, delivery calculations, and deep-linked WhatsApp order requests automatically.
- **Aesthetic Visual Design:** Crafted with beautiful HSL-tailored colors, high-end glassmorphism elements, custom fonts, fluid gradient animations, and smooth transitions powered by Framer Motion.

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite v6](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion for React](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Integration Capabilities:** Pre-configured database hooks (`handleCheckoutSubmit`) for server-side REST API/Gemini API integrations.

---

## 📂 Project Directory Structure

```bash
Criscraft.com/
├── assets/             # Static design assets and graphics
├── src/
│   ├── components/     # UI Component Layer
│   │   ├── BasketView.tsx      # Cart, checkout forms, QR payment, & WhatsApp deep-link
│   │   ├── CraftCatalog.tsx    # Filtered products list
│   │   ├── Footer.tsx          # Interactive shop footer
│   │   ├── Hero.tsx            # Shop banner and promo call-outs
│   │   ├── Navbar.tsx          # Sticky navigation header
│   │   ├── ProcessGuide.tsx    # Ordering process documentation step-by-step
│   │   ├── ProductCard.tsx     # Product listing tile
│   │   ├── ProductDetail.tsx   # Detailed item custom options selector
│   │   └── ShopView.tsx        # Responsive grid layout for shopping tab
│   ├── data.ts         # Mock product inventory and theme settings
│   ├── types.ts        # TypeScript declarations
│   ├── index.css       # Core typography, animations, and custom CSS classes
│   ├── main.tsx        # React entrypoint
│   └── App.tsx         # Unified state orchestrator and theme syncer
├── .gitignore          # Configured files/directories ignored by Git
├── index.html          # Main HTML markup
├── package.json        # Node dependency manifest
├── tsconfig.json       # TypeScript compiler settings
└── vite.config.ts      # Vite compilation configurations
```

---

## 💻 Local Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (Version `18.0.0` or higher is recommended)
- [Miniconda / Conda](https://docs.conda.io/en/latest/) (Optional, if using conda environment managers)

### 1. Clone & Navigate
```bash
git clone https://github.com/criscrafts/Criscraft.com.git
cd Criscraft.com
```

### 2. Environment Configuration
If needed, create a `.env.local` file in the root folder to supply any system-level keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies
Install the required packages:
```bash
npm install
```

### 4. Run the Development Server
Launch the application locally:
```bash
npm run dev
```
The server will boot and make the site accessible at:
- **Local:** `http://localhost:3000/`
- **Network:** `http://<your-local-ip>:3000/`

### 5. Build for Production
To bundle the static application for production deployment:
```bash
npm run build
```
This compiles the code into optimized chunks inside the `dist/` directory.

---

## 🤝 Contributing
1. Create a feature branch: `git checkout -b feature/amazing-change`
2. Commit your changes: `git commit -m "feat: add amazing updates"`
3. Push to your branch: `git push origin feature/amazing-change`
4. Submit a Pull Request.

---

*Handcrafted with love by CrisCrafts team.*
