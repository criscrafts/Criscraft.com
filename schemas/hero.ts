export default {
  name: "homepageHero",
  title: "Homepage Hero",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Hero Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Hero Subtitle",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mainImage",
      title: "Showcase Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "primaryButtonText",
      title: "Primary Action Text",
      type: "string",
      initialValue: "Explore Collections",
    },
    {
      name: "primaryButtonLink",
      title: "Primary Action Link",
      type: "string",
      initialValue: "/shop",
    },
    {
      name: "secondaryButtonText",
      title: "Secondary Action Text",
      type: "string",
      initialValue: "Our Story",
    },
    {
      name: "secondaryButtonLink",
      title: "Secondary Action Link",
      type: "string",
      initialValue: "/#our-story",
    },
  ],
};
