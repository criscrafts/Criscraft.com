export default {
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "FAQ Category (e.g. Orders, Shipping, Payments)",
      type: "string",
      initialValue: "General",
    },
  ],
};
