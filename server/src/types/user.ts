export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthUserResponse = User & {
  token: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};
