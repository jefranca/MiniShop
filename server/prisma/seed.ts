import { prisma } from '../src/lib/prisma.js';
import { productSeed } from '../src/data/products.js';

async function main() {
  await prisma.product.deleteMany();
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
