import { ValidationError } from '../errors/ValidationError.js';
import type { OrderInput, OrderItemInput } from '../types/order.js';

function validateOrderItem(input: Partial<OrderItemInput>) {
  if (
    typeof input.id !== 'number' ||
    !input.name ||
    !input.category ||
    typeof input.price !== 'number' ||
    !input.image ||
    !input.description ||
    typeof input.quantity !== 'number'
  ) {
    throw new ValidationError('Order items must include product data and quantity.');
  }

  return {
    id: input.id,
    name: input.name,
    category: input.category,
    price: input.price,
    image: input.image,
    description: input.description,
    quantity: input.quantity,
  };
}

export function validateOrderInput(input: Partial<OrderInput>) {
  const {
    userId,
    customerName,
    email,
    cep,
    street,
    number,
    neighborhood,
    city,
    state,
    paymentMethod,
    subtotal,
    shipping,
    discount,
    total,
    items,
  } = input;

  if (
    typeof userId !== 'number' ||
    !customerName ||
    !email ||
    !cep ||
    !street ||
    !number ||
    !neighborhood ||
    !city ||
    !state ||
    !paymentMethod ||
    typeof subtotal !== 'number' ||
    typeof shipping !== 'number' ||
    typeof discount !== 'number' ||
    typeof total !== 'number' ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new ValidationError('Order payload is incomplete.');
  }

  return {
    userId,
    customerName,
    email,
    cep,
    street,
    number,
    neighborhood,
    city,
    state,
    paymentMethod,
    subtotal,
    shipping,
    discount,
    total,
    items: items.map((item) => validateOrderItem(item)),
  };
}

export function validateUserId(rawUserId: string) {
  const userId = Number(rawUserId);

  if (Number.isNaN(userId)) {
    throw new ValidationError('User id must be a valid number.');
  }

  return userId;
}
