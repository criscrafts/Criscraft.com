export default {
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Collection Title",
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
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "image",
      title: "Collection Banner Image",
      type: "image",
      options: { hotspot: true },
    },
  ],
};
