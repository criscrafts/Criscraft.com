export default {
  name: "optionGroup",
  title: "Option Group",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Option Group Name",
      type: "string",
      description: "e.g., Bouquet Size, Flower Color, Wrapper Style, Keyring Color",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Selection Display Type",
      type: "string",
      options: {
        list: [
          { title: "Primary Size / Count (Switches Photo Gallery)", value: "size" },
          { title: "Color Swatches (Circular Color Picker)", value: "color" },
          { title: "Wrapper Swatches (Textured Swatches)", value: "wrapper" },
          { title: "Pills / Button Selectors", value: "radio" },
          { title: "Dropdown Select", value: "select" },
        ],
      },
      initialValue: "color",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "required",
      title: "Required Selection",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "options",
      title: "Available Options List",
      type: "array",
      of: [{ type: "optionValue" }],
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
};
