import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/sanity";
import { ProductClient } from "@/components/ProductClient";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600; // Cache single product details for 10 minutes

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    return {
      title: "Product Not Found | CrisCrafts",
    };
  }

  return {
    title: `${product.title} | CrisCrafts Handmade Boutique`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | CrisCrafts`,
      description: product.description.slice(0, 160),
      images: [{ url: product.images?.[0] || "" }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  // Fetch product detail and whole catalog in parallel
  const [product, allProducts] = await Promise.all([
    getProductBySlug(resolvedParams.slug),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  // Filter recommendations: same category, excluding active item
  const relatedProducts = allProducts.filter(
    (p) => p.category?.slug === product.category?.slug && p._id !== product._id
  );

  return (
    <ProductClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
