export default {
  name: "settings",
  title: "Global Settings",
  type: "document",
  fields: [
    {
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "CrisCrafts",
    },
    {
      name: "logo",
      title: "Brand Logo (Image)",
      type: "image",
    },
    {
      name: "announcementText",
      title: "Header Announcement text (e.g. Free shipping inside valley!)",
      type: "string",
    },
    {
      name: "whatsappNumber",
      title: "Artisan WhatsApp number (e.g. +9779800000000)",
      type: "string",
      description: "Must include country code, no spaces or special symbols.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "contactEmail",
      title: "Contact Email Address",
      type: "string",
      initialValue: "hello@criscrafts.com",
    },
    {
      name: "socialInstagram",
      title: "Instagram Page Link",
      type: "string",
    },
    {
      name: "socialFacebook",
      title: "Facebook Page Link",
      type: "string",
    },
  ],
};
