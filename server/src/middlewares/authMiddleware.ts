import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { verifyToken } from '../lib/jwt.js';

export type AuthenticatedRequest = Request & {
  authUser?: {
    userId: number;
    email: string;
    name: string;
  };
};

export function authMiddleware(
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    next(new AppError('Authentication token is required.', 401));
    return;
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const payload = verifyToken(token);
    request.authUser = {
      userId: Number(payload.sub),
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    next(new AppError('Invalid authentication token.', 401));
  }
}
