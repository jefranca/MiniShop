import { productSeed } from './products.js';

export const categorySeed = Array.from(new Set(productSeed.map((product) => product.category))).map(
  (name, index) => ({
    id: index + 1,
    name,
  }),
);
