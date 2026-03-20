import cors from 'cors';
import express from 'express';
import { signInController, signUpController } from './controllers/authController.js';
import {
  createCategoryController,
  listCategoriesController,
} from './controllers/categoryController.js';
import {
  createOrderController,
  listUserOrdersController,
} from './controllers/orderController.js';
import {
  showUserProfileController,
  updateUserProfileController,
} from './controllers/userController.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
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
app.post('/api/auth/signup', (request, response, next) => {
  void signUpController(request, response).catch(next);
});
app.post('/api/auth/signin', (request, response, next) => {
  void signInController(request, response).catch(next);
});
app.get('/api/users/:userId/orders', authMiddleware, (request, response, next) => {
  void listUserOrdersController(request, response).catch(next);
});
app.get('/api/users/:userId/profile', authMiddleware, (request, response, next) => {
  void showUserProfileController(request, response).catch(next);
});
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
app.post('/api/orders', authMiddleware, (request, response, next) => {
  void createOrderController(request, response).catch(next);
});
app.put('/api/users/:userId/profile', authMiddleware, (request, response, next) => {
  void updateUserProfileController(request, response).catch(next);
});
app.put('/api/products/:id', (request, response, next) => {
  void updateProductController(request, response).catch(next);
});
app.delete('/api/products/:id', (request, response, next) => {
  void deleteProductController(request, response).catch(next);
});

app.use(errorHandler);
