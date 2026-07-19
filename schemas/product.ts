export default {
  name: "product",
  title: "Product Template",
  type: "document",
  fieldsets: [
    { name: "basic", title: "Basic Information" },
    { name: "pricing", title: "Pricing & Stock" },
    { name: "gallery", title: "Product Gallery & Gallery Groups" },
    { name: "customization", title: "Customization & Add-ons Architecture" },
    { name: "metadata", title: "SEO & Delivery Info" },
  ],
  fields: [
    // Basic Info
    {
      name: "title",
      title: "Product Title",
      type: "string",
      description: "Master product template name (e.g. Ribbon Bouquet, Fuzzy Wire Daisy, Crochet Bunny)",
      fieldset: "basic",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "basic",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      fieldset: "basic",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      fieldset: "basic",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
      fieldset: "basic",
    },
    {
      name: "featured",
      title: "Featured Showcase Product",
      type: "boolean",
      fieldset: "basic",
      initialValue: false,
    },
    {
      name: "tags",
      title: "Product Tags",
      type: "array",
      fieldset: "basic",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },

    // Pricing & Stock
    {
      name: "price",
      title: "Base Price (Rs.)",
      type: "number",
      fieldset: "pricing",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "discountPrice",
      title: "Discount Price (Rs.)",
      type: "number",
      fieldset: "pricing",
      description: "Optional sale price overriding base price.",
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: "availability",
      title: "In Stock & Available",
      type: "boolean",
      fieldset: "pricing",
      initialValue: true,
    },
    {
      name: "rating",
      title: "Average Rating",
      type: "number",
      fieldset: "pricing",
      initialValue: 5.0,
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: "reviewsCount",
      title: "Number of Reviews",
      type: "number",
      fieldset: "pricing",
      initialValue: 0,
    },

    // Product Gallery & Gallery Groups
    {
      name: "images",
      title: "Default Product Gallery (Fallback)",
      type: "array",
      fieldset: "gallery",
      description: "Default photo set shown on page load before a specific size gallery is triggered.",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "galleryGroups",
      title: "Gallery Groups (Size-Linked Photo Sets)",
      type: "array",
      fieldset: "gallery",
      description: "Photo sets that automatically switch when the customer selects different sizes (e.g., Single Rose vs 5 Roses vs 20 Roses). Each contains 4-6 curated photos.",
      of: [{ type: "galleryGroup" }],
    },

    // Customization & Add-ons Architecture
    {
      name: "optionGroups",
      title: "Customization Option Groups",
      type: "array",
      fieldset: "customization",
      description: "Configurable options (Bouquet Size, Flower Color, Wrapper, Keyring Style, etc.).",
      of: [{ type: "optionGroup" }],
    },
    {
      name: "addons",
      title: "Reusable Add-ons Available",
      type: "array",
      fieldset: "customization",
      description: "Select reusable add-on items available for this product (Glitter, Snow Paper, Pearls, LED Lights, Mini Teddy, etc.).",
      of: [{ type: "reference", to: [{ type: "addon" }] }],
    },

    // Legacy Toggles for backward compatibility
    {
      name: "hasGiftNoteOption",
      title: "Enable Gift Card Message Note Area",
      type: "boolean",
      fieldset: "customization",
      initialValue: true,
    },

    // Metadata & SEO
    {
      name: "deliveryInfo",
      title: "Delivery Information Notes",
      type: "string",
      fieldset: "metadata",
      initialValue: "Handcrafted to order. Ships nationwide in 3-5 business days.",
    },
  ],
};
