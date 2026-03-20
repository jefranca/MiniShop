import type { AuthResponse, AuthUser } from '../types/user';
import { apiRequest } from './api';

const USERS_BASE_URL = 'http://localhost:3333/api/users';

export function getUserProfile(userId: number, token: string) {
  return apiRequest<Omit<AuthUser, 'token'>>(`${USERS_BASE_URL}/${userId}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((user) => ({
    ...user,
    token,
  }));
}

export function updateUserProfile(
  userId: number,
  token: string,
  payload: { name: string; email: string },
) {
  return apiRequest<AuthResponse>(`${USERS_BASE_URL}/${userId}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
