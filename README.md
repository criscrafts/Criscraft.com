# 🎨 CrisCrafts Artisan Boutique — Luxury Handcrafted E-Commerce Platform

Welcome to the official repository for **CrisCrafts Artisan Boutique**, a luxury handcrafted e-commerce web application engineered with Next.js, Sanity CMS, Tailwind CSS, and a Google Sheets & Drive Database Bridge.

---

## ✨ Features & Highlights

### 🛍️ Luxury Shopping & Interactive Customization
- **Interactive Product Customizer**: Select bouquet sizes, ribbon colors, wrapper styles, gift notes, and premium add-ons (`Spray Sparkly Glitter Dust`, `Textured Snow Paper`, `Dainty Pearl Blossom Pins`, `Warm LED Fairy Lights`, `Mini Plushie Bear Companions`).
- **Dynamic Pricing Engine**: Server-side price recalculation preventing client-side price tampering.
- **WhatsApp Checkout Bridge**: Compiles detailed order specifications and opens WhatsApp with pre-filled order data for payment & delivery confirmation.

### 📊 Google Sheets & Drive Order Ledger (CrisCraft Studios v4)
- **Fail-Safe Access**: Uses `SPREADSHEET_ID` fallback to prevent document access errors.
- **Automated Multi-Year Ledgers**: Automatically creates year-by-year order tabs (`Orders 2026`, `Orders 2027`) with order status dropdowns.
- **Automated PDF Invoice Generator**: Generates branded PDF receipts in Google Drive (`CrisCrafts Invoices` folder) and attaches clickable links in the Sheet.
- **Instant Admin Email Notifications**: Sends HTML email notifications to the boutique owner upon every checkout.
- **Executive Dashboard v4**: Real-time KPI Cards (Revenue, Orders Count, Current Year Revenue, AOV, Pending, Delivered), Regional Breakdown (Inside vs. Outside Valley), Order Status Breakdown, and Multi-Year Ledger Performance.
- **Interactive Menu (`CrisCrafts Studio 🎨`)**: Toolbar options for VIP Customer Search, One-Click Google Drive CSV Backups, Metrics Refresh, and Health Diagnostics.

### 📰 Headless Content Management (Sanity CMS)
- Manage products, categories, option groups, add-ons, hero banners, testimonials, and FAQs live from `/studio`.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Luxury Custom CSS Tokens
- **CMS**: Sanity CMS (`next-sanity`, `@sanity/image-url`)
- **Icons**: Lucide React
- **Database & Webhooks**: Google Apps Script, Google Sheets API, Google Drive API

---

## 🚀 Environment Setup

Create a `.env.local` file in the root directory:

```env
# ----------------------------------------
# 1. Sanity CMS Integration
# ----------------------------------------
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# ----------------------------------------
# 2. WhatsApp Integration
# ----------------------------------------
NEXT_PUBLIC_WHATSAPP_NUMBER=+9779841751472

# ----------------------------------------
# 3. Google Sheets Order Ledger
# ----------------------------------------
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

For complete Google Apps Script installation instructions, refer to [GOOGLE_SHEETS_BRIDGE.md](./GOOGLE_SHEETS_BRIDGE.md).

---

## 💻 Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build & Verification

To verify production build readiness:

```bash
npm run build
```

---

## 📄 Documentation Links
- [Google Sheets Bridge & Apps Script Guide](./GOOGLE_SHEETS_BRIDGE.md)
