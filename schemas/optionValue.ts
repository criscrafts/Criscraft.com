export default {
  name: "optionValue",
  title: "Option Value",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Display Name",
      type: "string",
      description: "e.g., Blush Pink, Vintage Gold Satin, 5 Roses",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "value",
      title: "Value / Slug",
      type: "string",
      description: "Machine-friendly identifier, e.g., 5-roses, blush-pink",
    },
    {
      name: "priceImpact",
      title: "Price Adjustment (Rs.)",
      type: "number",
      description: "Additional cost added to base price when this option is selected.",
      initialValue: 0,
    },
    {
      name: "hexColor",
      title: "Hex Color Value",
      type: "string",
      description: "Used for color swatches, e.g. #F28F9E or #3B79C6",
    },
    {
      name: "swatchImage",
      title: "Swatch Texture Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional texture swatch for wrappers or special fabrics.",
    },
    {
      name: "previewImage",
      title: "Main Preview Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional hero image preview that displays when this option is selected.",
    },
    {
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    },
    {
      name: "availability",
      title: "Available",
      type: "boolean",
      initialValue: true,
    },
  ],
};
