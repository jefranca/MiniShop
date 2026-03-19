import { apiRequest } from './api';
import type { Product } from '../types/product';

type ProductPayload = Omit<Product, 'id'>;

export function listProducts() {
  return apiRequest<Product[]>('/api/products').catch(() => {
    throw new Error('Falha ao buscar produtos.');
  });
}

export function createProduct(payload: ProductPayload) {
  return apiRequest<Product>('/api/products', {
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
  return apiRequest<Product>(`/api/products/${productId}`, {
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
  return apiRequest<{ message: string }>(`/api/products/${productId}`, {
    method: 'DELETE',
  }).catch(() => {
    throw new Error('Nao foi possivel remover o produto.');
  });
}
