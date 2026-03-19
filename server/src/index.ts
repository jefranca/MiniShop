import cors from 'cors';
import express from 'express';
import { findProductById, listProducts } from './services/productService.js';

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

app.get('/api/products/:id', (request, response) => {
  const productId = Number(request.params.id);

  if (Number.isNaN(productId)) {
    response.status(400).json({ message: 'Product id must be a valid number.' });
    return;
  }

  const product = findProductById(productId);

  if (!product) {
    response.status(404).json({ message: 'Product not found.' });
    return;
  }

  response.json(product);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`MiniShop API running on http://localhost:${port}`);
  });
}
