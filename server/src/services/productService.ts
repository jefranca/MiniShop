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

export function updateProduct(productId: number, input: ProductInput) {
  const existingProduct = findProductById(productId);

  if (!existingProduct) {
    return null;
  }

  const updatedProduct: Product = {
    id: productId,
    ...input,
  };

  products = products.map((product) => (product.id === productId ? updatedProduct : product));

  return updatedProduct;
}

export function deleteProduct(productId: number) {
  const existingProduct = findProductById(productId);

  if (!existingProduct) {
    return null;
  }

  products = products.filter((product) => product.id !== productId);

  return existingProduct;
}

export function resetProducts() {
  products = [...productSeed];
}
