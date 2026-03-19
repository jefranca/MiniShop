import { ValidationError } from '../errors/ValidationError.js';

export function validateCategoryInput(input: Partial<{ name: string }>) {
  const name = input.name?.trim();

  if (!name) {
    throw new ValidationError('Category name is required.');
  }

  return { name };
}
