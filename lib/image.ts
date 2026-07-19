import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./sanity";

const builder = imageUrlBuilder(sanityClient);

const CRAFT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80";

/**
 * Resolves an image source to a fully qualified URL.
 * Handles string URLs, Sanity asset objects/references, nested arrays, and fallback craft images.
 */
export function urlFor(source: any): string {
  if (!source) {
    return CRAFT_FALLBACK_IMAGE;
  }

  // Handle array of images passed directly
  if (Array.isArray(source)) {
    if (source.length === 0) return CRAFT_FALLBACK_IMAGE;
    return urlFor(source[0]);
  }
  
  // Direct HTTP or absolute path string
  if (typeof source === "string") {
    if (source.startsWith("http") || source.startsWith("//") || source.startsWith("/")) {
      return source;
    }
  }

  // Dereferenced object with direct url field
  if (typeof source === "object") {
    if (source.url && typeof source.url === "string") {
      return source.url;
    }
    if (source.asset && typeof source.asset.url === "string") {
      return source.asset.url;
    }
  }

  try {
    const generatedUrl = builder.image(source).auto("format").fit("max").url();
    if (generatedUrl && generatedUrl.length > 0) {
      return generatedUrl;
    }
  } catch (error) {
    console.warn("Failed to build image URL from source, returning standard craft fallback.", error);
  }

  return CRAFT_FALLBACK_IMAGE;
}
