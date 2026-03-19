import type { Product } from './product.js';

export type OrderItemInput = Product & {
  quantity: number;
};

export type OrderInput = {
  userId: number;
  customerName: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: OrderItemInput[];
};

export type OrderSummary = {
  id: number;
  userId: number;
  customerName: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: Date;
  items: OrderItemInput[];
};
