export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Product Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "price",
      title: "Base Price (Rs.)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "discountPrice",
      title: "Discount Price (Rs.)",
      type: "number",
      description: "Optional sale price that overrides the base price.",
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    },
    {
      name: "availability",
      title: "In Stock & Available",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "tags",
      title: "Product Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "rating",
      title: "Average Rating",
      type: "number",
      initialValue: 5.0,
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: "reviewsCount",
      title: "Number of Reviews",
      type: "number",
      initialValue: 0,
    },
    {
      name: "hasGlitterOption",
      title: "Enable Glitter Add-on Option",
      type: "boolean",
      description: "Adds a toggle to add glitter spray for Rs. 50.",
      initialValue: false,
    },
    {
      name: "hasSnowPaperOption",
      title: "Enable Snow Paper Wrapping Option",
      type: "boolean",
      description: "Adds a toggle to wrap with textured snow paper for Rs. 100.",
      initialValue: false,
    },
    {
      name: "hasGiftNoteOption",
      title: "Enable Gift Note Message Option",
      type: "boolean",
      description: "Adds a text area for custom gift messages.",
      initialValue: true,
    },
    {
      name: "variants",
      title: "Custom Selection Options",
      type: "array",
      description: "Custom dropdown selections such as colors, styles, textures.",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            { name: "name", title: "Option Group Name (e.g., Flower Color)", type: "string" },
            { name: "required", title: "Required Selection", type: "boolean", initialValue: true },
            {
              name: "options",
              title: "Available Options",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "name", title: "Option Value Name (e.g., Blush Pink)", type: "string" },
                    { name: "priceImpact", title: "Additional Price Cost (Rs.)", type: "number", initialValue: 0 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
