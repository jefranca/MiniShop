import cors from 'cors';
import express from 'express';
import {
  createProduct,
  deleteProduct,
  findProductById,
  listProducts,
  updateProduct,
} from './services/productService.js';
import type { ProductInput } from './types/product.js';

export const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'MiniShop API' });
});

app.get('/api/products', (_request, response) => {
  void listProducts().then((products) => {
    response.json(products);
  });
});

app.get('/api/products/:id', (request, response) => {
  const productId = Number(request.params.id);

  if (Number.isNaN(productId)) {
    response.status(400).json({ message: 'Product id must be a valid number.' });
    return;
  }

  void findProductById(productId).then((product) => {
    if (!product) {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }

    response.json(product);
  });
});

app.post('/api/products', (request, response) => {
  const { name, category, price, image, description } = request.body as Partial<ProductInput>;

  if (!name || !category || typeof price !== 'number' || !image || !description) {
    response.status(400).json({
      message: 'Name, category, price, image and description are required.',
    });
    return;
  }

  void createProduct({
    name,
    category,
    price,
    image,
    description,
  }).then((product) => {
    response.status(201).json(product);
  });
});

app.put('/api/products/:id', (request, response) => {
  const productId = Number(request.params.id);
  const { name, category, price, image, description } = request.body as Partial<ProductInput>;

  if (Number.isNaN(productId)) {
    response.status(400).json({ message: 'Product id must be a valid number.' });
    return;
  }

  if (!name || !category || typeof price !== 'number' || !image || !description) {
    response.status(400).json({
      message: 'Name, category, price, image and description are required.',
    });
    return;
  }

  void updateProduct(productId, {
    name,
    category,
    price,
    image,
    description,
  }).then((product) => {
    if (!product) {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }

    response.json(product);
  });
});

app.delete('/api/products/:id', (request, response) => {
  const productId = Number(request.params.id);

  if (Number.isNaN(productId)) {
    response.status(400).json({ message: 'Product id must be a valid number.' });
    return;
  }

  void deleteProduct(productId).then((product) => {
    if (!product) {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }

    response.json({
      message: 'Product deleted successfully.',
      product,
    });
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`MiniShop API running on http://localhost:${port}`);
  });
}
