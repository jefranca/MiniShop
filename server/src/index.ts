import cors from 'cors';
import express from 'express';
import { listProducts } from './services/productService.js';

export const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'MiniShop API' });
});

app.get('/api/products', (_request, response) => {
  response.json(listProducts());
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`MiniShop API running on http://localhost:${port}`);
  });
}
