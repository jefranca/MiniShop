import { productSeed } from '../data/products.js';
import { categorySeed } from '../data/categories.js';
import { prisma } from '../lib/prisma.js';
import type { Product, ProductInput } from '../types/product.js';
import { resetUsers } from './userService.js';

async function syncSequence(tableName: string) {
  await prisma.$executeRawUnsafe(
    `
      SELECT setval(
        pg_get_serial_sequence('"${tableName}"', 'id'),
        COALESCE((SELECT MAX(id) FROM "${tableName}"), 1)
      );
    `,
  );
}

export function listProducts() {
  return prisma.product.findMany({
    orderBy: {
      id: 'asc',
    },
  }) as Promise<Product[]>;
}

export function findProductById(productId: number) {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
  }) as Promise<Product | null>;
}

export function createProduct(input: ProductInput) {
  return prisma.product.create({
    data: input,
  }) as Promise<Product>;
}

export async function updateProduct(productId: number, input: ProductInput) {
  const existingProduct = await findProductById(productId);

  if (!existingProduct) {
    return null;
  }

  return (await prisma.product.update({
    where: {
      id: productId,
    },
    data: input,
  })) as Product;
}

export async function deleteProduct(productId: number) {
  const existingProduct = await findProductById(productId);

  if (!existingProduct) {
    return null;
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return existingProduct;
}

export async function resetProducts() {
  await resetUsers();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: categorySeed,
  });
  await prisma.product.createMany({
    data: productSeed,
  });
  await syncSequence('categories');
  await syncSequence('products');
}
