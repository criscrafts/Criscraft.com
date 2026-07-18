export default {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    {
      name: "author",
      title: "Author Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "role",
      title: "Author Role/Designation (e.g., Collector)",
      type: "string",
    },
    {
      name: "text",
      title: "Testimonial text",
      type: "text",
      validation: (Rule: any) => Rule.required().max(400),
    },
    {
      name: "rating",
      title: "Rating (Stars)",
      type: "number",
      initialValue: 5,
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: "avatar",
      title: "Author Avatar Image",
      type: "image",
      options: { hotspot: true },
    },
  ],
};
