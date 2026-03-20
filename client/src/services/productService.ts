import { apiRequest } from './api';
import { buildApiUrl } from './config';
import type { Product } from '../types/product';

type ProductPayload = Omit<Product, 'id'>;

export function listProducts() {
  return apiRequest<Product[]>(buildApiUrl('/api/products')).catch(() => {
    throw new Error('Falha ao buscar produtos.');
  });
}

export function createProduct(payload: ProductPayload) {
  return apiRequest<Product>(buildApiUrl('/api/products'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    throw new Error('Nao foi possivel criar o produto.');
  });
}

export function updateProduct(productId: number, payload: ProductPayload) {
  return apiRequest<Product>(buildApiUrl(`/api/products/${productId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    throw new Error('Nao foi possivel atualizar o produto.');
  });
}

export function deleteProduct(productId: number) {
  return apiRequest<{ message: string }>(buildApiUrl(`/api/products/${productId}`), {
    method: 'DELETE',
  }).catch(() => {
    throw new Error('Nao foi possivel remover o produto.');
  });
}
