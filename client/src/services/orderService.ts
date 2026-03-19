import type { Order, OrderPayload, OrderResponse } from '../types/order';
import { apiRequest } from './api';

const ORDERS_BASE_URL = 'http://localhost:3333/api';

export function createOrder(payload: OrderPayload) {
  return apiRequest<OrderResponse>(`${ORDERS_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export function listOrdersByUser(userId: number) {
  return apiRequest<Order[]>(`${ORDERS_BASE_URL}/users/${userId}/orders`);
}
