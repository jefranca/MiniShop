import jwt from 'jsonwebtoken';
import type { User } from '../types/user.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'minishop-dev-secret';

export function generateToken(user: User) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    sub: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
  };
}
