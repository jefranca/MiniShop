import type { Response } from 'express';
import { NotFoundError } from '../errors/NotFoundError.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { generateToken } from '../lib/jwt.js';
import { findUserById, updateUserProfile } from '../services/userService.js';
import { validateUserId } from '../validations/orderValidation.js';
import { validateProfileUpdateInput } from '../validations/userValidation.js';

export async function showUserProfileController(
  request: AuthenticatedRequest,
  response: Response,
) {
  const userId = validateUserId(String(request.params.userId));

  if (request.authUser?.userId !== userId) {
    throw new NotFoundError('User not found.');
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  response.json(user);
}

export async function updateUserProfileController(
  request: AuthenticatedRequest,
  response: Response,
) {
  const userId = validateUserId(String(request.params.userId));

  if (request.authUser?.userId !== userId) {
    throw new NotFoundError('User not found.');
  }

  const profileInput = validateProfileUpdateInput(request.body);
  const user = await updateUserProfile(userId, profileInput);

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  response.json({
    message: 'Profile updated successfully.',
    user: {
      ...user,
      token: generateToken(user),
    },
  });
}
