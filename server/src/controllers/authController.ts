import type { Request, Response } from 'express';
import { ValidationError } from '../errors/ValidationError.js';
import { createUser, signInUser } from '../services/userService.js';
import { validateSignInInput, validateSignUpInput } from '../validations/authValidation.js';

export async function signUpController(request: Request, response: Response) {
  const userInput = validateSignUpInput(request.body);
  const user = await createUser(userInput);

  response.status(201).json({
    message: 'User created successfully.',
    user,
  });
}

export async function signInController(request: Request, response: Response) {
  const signInInput = validateSignInInput(request.body);
  const user = await signInUser(signInInput);

  if (!user) {
    throw new ValidationError('Invalid email or password.');
  }

  response.json({
    message: 'Sign in successful.',
    user,
  });
}
