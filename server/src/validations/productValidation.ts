import { ValidationError } from '../errors/ValidationError.js';
import type { ProductInput } from '../types/product.js';

export function validateProductId(rawProductId: string) {
  const productId = Number(rawProductId);

  if (Number.isNaN(productId)) {
    throw new ValidationError('Product id must be a valid number.');
  }

  return productId;
}

export function validateProductInput(input: Partial<ProductInput>) {
  const { name, category, price, image, description } = input;

  if (!name || !category || typeof price !== 'number' || !image || !description) {
    throw new ValidationError('Name, category, price, image and description are required.');
  }

  return {
    name,
    category,
    price,
    image,
    description,
  };
}
