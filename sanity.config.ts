import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "criscrafts-studio",
  title: "CrisCrafts Artisan Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
