export default {
  name: "galleryGroup",
  title: "Gallery Group",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Gallery Title",
      type: "string",
      description: "e.g., 5 Roses Gallery, Single Stem View, Grand 20 Roses Showcase",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "optionValue",
      title: "Corresponding Size Option Value",
      type: "string",
      description: "Must match the primary size option value or name, e.g., '5-roses' or '5 Roses'. When customer selects this size, gallery switches to this photo set.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "images",
      title: "Gallery Group Photos (4-6 Photos)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "defaultImage",
      title: "Default Cover Photo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    },
  ],
};
