import { productSeed } from '../data/products.js';
import type { Product, ProductInput } from '../types/product.js';

let products: Product[] = [...productSeed];

export function listProducts() {
  return products;
}

export function findProductById(productId: number) {
  return products.find((product) => product.id === productId) ?? null;
}

export function createProduct(input: ProductInput) {
  const nextId = products.length === 0 ? 1 : Math.max(...products.map((product) => product.id)) + 1;
  const product: Product = {
    id: nextId,
    ...input,
  };

  products = [...products, product];

  return product;
}

export function resetProducts() {
  products = [...productSeed];
}
