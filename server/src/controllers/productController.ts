import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { findCategoryByName } from '../services/categoryService.js';
import {
  createProduct,
  deleteProduct,
  findProductById,
  listProducts,
  updateProduct,
} from '../services/productService.js';
import { validateProductId, validateProductInput } from '../validations/productValidation.js';

export async function healthController(_request: Request, response: Response) {
  response.json({ status: 'ok', service: 'MiniShop API' });
}

export async function listProductsController(_request: Request, response: Response) {
  const products = await listProducts();
  response.json(products);
}

export async function showProductController(request: Request, response: Response) {
  const productId = validateProductId(String(request.params.id));
  const product = await findProductById(productId);

  if (!product) {
    throw new NotFoundError('Product not found.');
  }

  response.json(product);
}

export async function createProductController(request: Request, response: Response) {
  const productInput = validateProductInput(request.body);
  const category = await findCategoryByName(productInput.category);

  if (!category) {
    throw new ValidationError('Category does not exist.');
  }

  const product = await createProduct(productInput);

  response.status(201).json(product);
}

export async function updateProductController(request: Request, response: Response) {
  const productId = validateProductId(String(request.params.id));
  const productInput = validateProductInput(request.body);
  const category = await findCategoryByName(productInput.category);

  if (!category) {
    throw new ValidationError('Category does not exist.');
  }

  const product = await updateProduct(productId, productInput);

  if (!product) {
    throw new NotFoundError('Product not found.');
  }

  response.json(product);
}

export async function deleteProductController(request: Request, response: Response) {
  const productId = validateProductId(String(request.params.id));
  const product = await deleteProduct(productId);

  if (!product) {
    throw new NotFoundError('Product not found.');
  }

  response.json({
    message: 'Product deleted successfully.',
    product,
  });
}
