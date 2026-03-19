import { productSeed } from '../data/products.js';
import type { Product } from '../types/product.js';

let products: Product[] = [...productSeed];

export function listProducts() {
  return products;
}

export function findProductById(productId: number) {
  return products.find((product) => product.id === productId) ?? null;
}

export function resetProducts() {
  products = [...productSeed];
}
