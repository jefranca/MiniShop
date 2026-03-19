import type { Request, Response } from 'express';
import { ValidationError } from '../errors/ValidationError.js';
import { createCategory, findCategoryByName, listCategories } from '../services/categoryService.js';
import { validateCategoryInput } from '../validations/categoryValidation.js';

export async function listCategoriesController(_request: Request, response: Response) {
  const categories = await listCategories();
  response.json(categories);
}

export async function createCategoryController(request: Request, response: Response) {
  const categoryInput = validateCategoryInput(request.body);
  const existingCategory = await findCategoryByName(categoryInput.name);

  if (existingCategory) {
    throw new ValidationError('Category already exists.');
  }

  const category = await createCategory(categoryInput);
  response.status(201).json(category);
}
