export type AuthUser = {
  id: number;
  name: string;
  email: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};
