import React from "react";
import { getProducts, getCategories } from "@/lib/sanity";
import { ShopClient } from "@/components/ShopClient";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export const revalidate = 600; // Cache shop archive updates every 10 minutes

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [products, categories, resolvedParams] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  const initialCategory = resolvedParams.category || "";

  return (
    <ShopClient
      products={products}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}
