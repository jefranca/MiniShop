import type { ProductFormState } from '../../types/product';

export const categories = ['Todos', 'Moda', 'Tecnologia', 'Casa'];

export const initialProductForm: ProductFormState = {
  name: '',
  category: 'Moda',
  price: '',
  image: '',
  description: '',
};

export function getCurrentPage() {
  return window.location.hash === '#/admin' ? 'admin' : 'store';
}
