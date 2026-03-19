import type { Product } from '../types/product.js';

export const productSeed: Product[] = [
  {
    id: 1,
    name: 'Jaqueta Atlas',
    category: 'Moda',
    price: 249.9,
    image: '[jacket]',
    description: 'Camada premium para dias corridos, com textura leve e corte urbano.',
  },
  {
    id: 2,
    name: 'Fone Pulse Mini',
    category: 'Tecnologia',
    price: 179.9,
    image: '[headphones]',
    description: 'Som limpo, bateria de longa duracao e estojo compacto para o dia a dia.',
  },
  {
    id: 3,
    name: 'Luminaria Noma',
    category: 'Casa',
    price: 129.9,
    image: '[lamp]',
    description: 'Ponto de luz minimalista para mesas, quartos e cantinhos de leitura.',
  },
  {
    id: 4,
    name: 'Mochila Orbit',
    category: 'Moda',
    price: 219.9,
    image: '[backpack]',
    description: 'Espaco interno inteligente e design pensado para rotina, estudo e viagem.',
  },
  {
    id: 5,
    name: 'Speaker Loop',
    category: 'Tecnologia',
    price: 199.9,
    image: '[speaker]',
    description: 'Caixa de som portatil com graves fortes e acabamento resistente.',
  },
  {
    id: 6,
    name: 'Vaso Halo',
    category: 'Casa',
    price: 89.9,
    image: '[vase]',
    description: 'Detalhe organico para compor ambientes leves, quentes e acolhedores.',
  },
];
