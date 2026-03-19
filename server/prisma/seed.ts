import { prisma } from '../src/lib/prisma.js';
import { categorySeed } from '../src/data/categories.js';
import { productSeed } from '../src/data/products.js';

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
