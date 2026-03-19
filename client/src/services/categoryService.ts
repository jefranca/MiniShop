import type { Category } from '../types/product';
import { apiRequest } from './api';

export function listCategories() {
  return apiRequest<Category[]>('/api/categories').catch(() => {
    throw new Error('Falha ao buscar categorias.');
  });
}

export function createCategory(name: string) {
  return apiRequest<Category>('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  }).catch(() => {
    throw new Error('Nao foi possivel criar a categoria.');
  });
}
