import type { Order, OrderPayload, OrderResponse } from '../types/order';
import { apiRequest } from './api';

const ORDERS_BASE_URL = 'http://localhost:3333/api';

function withAuthToken(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function createOrder(payload: OrderPayload, token: string) {
  return apiRequest<OrderResponse>(`${ORDERS_BASE_URL}/orders`, {
    method: 'POST',
    headers: withAuthToken(token),
    body: JSON.stringify(payload),
  });
}

export function listOrdersByUser(userId: number, token: string) {
  return apiRequest<Order[]>(`${ORDERS_BASE_URL}/users/${userId}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
