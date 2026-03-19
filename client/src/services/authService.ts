import { apiRequest } from './api';
import type { AuthResponse, SignInPayload, SignUpPayload } from '../types/user';

const AUTH_BASE_URL = 'http://localhost:3333/api/auth';

export function signUp(payload: SignUpPayload) {
  return apiRequest<AuthResponse>(`${AUTH_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function signIn(payload: SignInPayload) {
  return apiRequest<AuthResponse>(`${AUTH_BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
