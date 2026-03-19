import { productSeed } from '../data/products.js';
import type { Product } from '../types/product.js';

let products: Product[] = [...productSeed];

export function listProducts() {
  return products;
}

export function resetProducts() {
  products = [...productSeed];
}
