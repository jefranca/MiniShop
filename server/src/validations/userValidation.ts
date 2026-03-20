import { ValidationError } from '../errors/ValidationError.js';

export function validateProfileUpdateInput(input: { name?: string; email?: string }) {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();

  if (!name || !email) {
    throw new ValidationError('Name and email are required.');
  }

  return {
    name,
    email,
  };
}
