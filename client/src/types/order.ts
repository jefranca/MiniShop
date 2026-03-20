import type { CartItem } from './product';

export type OrderPayload = {
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
  items: CartItem[];
};

export type Order = OrderPayload & {
  id: number;
  status: string;
  createdAt: string;
};

export type OrderResponse = {
  message: string;
  order: Order;
};
