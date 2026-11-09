import products from '../fixtures/products.json';
import type { Product } from './types';

/** Looks up catalog products by slug, keeping the given order. */
export const getProducts = (slugs: readonly string[]): Product[] =>
  slugs.map((slug) => {
    const product = products.catalog.find((item) => item.slug === slug);
    if (!product) {
      throw new Error(`Product "${slug}" is not defined in fixtures/products.json`);
    }
    return product;
  });
