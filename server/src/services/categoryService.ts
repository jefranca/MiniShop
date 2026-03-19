import { prisma } from '../lib/prisma.js';
import type { Category, CategoryInput } from '../types/category.js';

export function listCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  }) as Promise<Category[]>;
}

export function findCategoryByName(name: string) {
  return prisma.category.findUnique({
    where: {
      name,
    },
  }) as Promise<Category | null>;
}

export function createCategory(input: CategoryInput) {
  return prisma.category.create({
    data: input,
  }) as Promise<Category>;
}
