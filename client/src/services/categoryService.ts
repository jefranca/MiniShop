import type { Category } from '../types/product';
import { apiRequest } from './api';
import { buildApiUrl } from './config';

export function listCategories() {
  return apiRequest<Category[]>(buildApiUrl('/api/categories')).catch(() => {
    throw new Error('Falha ao buscar categorias.');
  });
}

export function createCategory(name: string) {
  return apiRequest<Category>(buildApiUrl('/api/categories'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  }).catch(() => {
    throw new Error('Nao foi possivel criar a categoria.');
  });
}
