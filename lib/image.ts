import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./sanity";

const builder = imageUrlBuilder(sanityClient);

/**
 * Resolves an image source to a fully qualified URL.
 * Handles both relative/absolute string URLs (mock dataset) and Sanity image references.
 */
export function urlFor(source: any): string {
  if (!source) {
    return "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80"; // standard default image fallback
  }
  
  if (typeof source === "string" && source.startsWith("http")) {
    return source;
  }

  try {
    return builder.image(source).auto("format").fit("max").url() || "";
  } catch (error) {
    console.warn("Failed to build image URL from source, returning standard fallback.", error);
    return "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80";
  }
}
