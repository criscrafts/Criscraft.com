import React from 'react';
import ShopView from './ShopView';
import { Product } from '../types';

interface CraftCatalogProps {
  onSelectProduct: (product: Product) => void;
  initialCategory?: 'Bouquet' | 'Keyring' | null;
}

export default function CraftCatalog(props: CraftCatalogProps) {
  return <ShopView {...props} />;
}
