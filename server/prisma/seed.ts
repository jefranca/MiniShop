import { prisma } from '../src/lib/prisma.js';
import { categorySeed } from '../src/data/categories.js';
import { productSeed } from '../src/data/products.js';

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

async function main() {
  await prisma.user.deleteMany();
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
