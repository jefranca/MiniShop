import { ValidationError } from '../errors/ValidationError.js';
import type { SignInInput, UserInput } from '../types/user.js';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateSignUpInput(input: Partial<UserInput>) {
  const name = input.name?.trim();
  const email = input.email ? normalizeEmail(input.email) : '';
  const password = input.password?.trim() ?? '';

  if (!name || !email || !password) {
    throw new ValidationError('Name, email and password are required.');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must contain at least 6 characters.');
  }

  return {
    name,
    email,
    password,
  };
}

export function validateSignInInput(input: Partial<SignInInput>) {
  const email = input.email ? normalizeEmail(input.email) : '';
  const password = input.password?.trim() ?? '';

  if (!email || !password) {
    throw new ValidationError('Email and password are required.');
  }

  return {
    email,
    password,
  };
}
