import cors from 'cors';
import express from 'express';
import {
  createCategoryController,
  listCategoriesController,
} from './controllers/categoryController.js';
import {
  createProductController,
  deleteProductController,
  healthController,
  listProductsController,
  showProductController,
  updateProductController,
} from './controllers/productController.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', healthController);
app.get('/api/categories', (request, response, next) => {
  void listCategoriesController(request, response).catch(next);
});
app.post('/api/categories', (request, response, next) => {
  void createCategoryController(request, response).catch(next);
});
app.get('/api/products', (request, response, next) => {
  void listProductsController(request, response).catch(next);
});
app.get('/api/products/:id', (request, response, next) => {
  void showProductController(request, response).catch(next);
});
app.post('/api/products', (request, response, next) => {
  void createProductController(request, response).catch(next);
});
app.put('/api/products/:id', (request, response, next) => {
  void updateProductController(request, response).catch(next);
});
app.delete('/api/products/:id', (request, response, next) => {
  void deleteProductController(request, response).catch(next);
});

app.use(errorHandler);
