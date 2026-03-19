import cors from 'cors';
import express from 'express';

export const app = express();
const port = Number(process.env.PORT ?? 3333);

export const products = [
  {
    id: 1,
    name: 'Jaqueta Atlas',
    category: 'Moda',
    price: 249.9,
    image: '🧥',
    description: 'Camada premium para dias corridos, com textura leve e corte urbano.',
  },
  {
    id: 2,
    name: 'Fone Pulse Mini',
    category: 'Tecnologia',
    price: 179.9,
    image: '🎧',
    description: 'Som limpo, bateria de longa duração e estojo compacto para o dia a dia.',
  },
  {
    id: 3,
    name: 'Luminaria Noma',
    category: 'Casa',
    price: 129.9,
    image: '💡',
    description: 'Ponto de luz minimalista para mesas, quartos e cantinhos de leitura.',
  },
  {
    id: 4,
    name: 'Mochila Orbit',
    category: 'Moda',
    price: 219.9,
    image: '🎒',
    description: 'Espaco interno inteligente e design pensado para rotina, estudo e viagem.',
  },
  {
    id: 5,
    name: 'Speaker Loop',
    category: 'Tecnologia',
    price: 199.9,
    image: '🔊',
    description: 'Caixa de som portatil com graves fortes e acabamento resistente.',
  },
  {
    id: 6,
    name: 'Vaso Halo',
    category: 'Casa',
    price: 89.9,
    image: '🪴',
    description: 'Detalhe organico para compor ambientes leves, quentes e acolhedores.',
  },
];

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'MiniShop API' });
});

app.get('/api/products', (_request, response) => {
  response.json(products);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`MiniShop API running on http://localhost:${port}`);
  });
}
