import type { Product, ProductFormState } from '../../types/product';

export function mapProductToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    image: product.image,
    description: product.description,
  };
}
