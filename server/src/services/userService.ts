import { ConflictError } from '../errors/ConflictError.js';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import type { SignInInput, User, UserInput } from '../types/user.js';

type PersistedUser = User & {
  passwordHash: string;
};

function toPublicUser(user: PersistedUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function findUserByEmail(email: string) {
  return (await prisma.user.findUnique({
    where: {
      email,
    },
  })) as PersistedUser | null;
}

export async function findUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user ? toPublicUser(user as PersistedUser) : null;
}

export async function createUser(input: UserInput) {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new ConflictError('User already exists with this email.');
  }

  const passwordHash = await hashPassword(input.password);
  const user = (await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
  })) as PersistedUser;

  return toPublicUser(user);
}

export async function signInUser(input: SignInInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(input.password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return toPublicUser(user);
}

export async function resetUsers() {
  await prisma.user.deleteMany();
}
