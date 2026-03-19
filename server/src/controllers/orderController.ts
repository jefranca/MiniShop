import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/NotFoundError.js';
import { createOrder, listOrdersByUser } from '../services/orderService.js';
import { findUserById } from '../services/userService.js';
import { validateOrderInput, validateUserId } from '../validations/orderValidation.js';

export async function createOrderController(request: Request, response: Response) {
  const orderInput = validateOrderInput(request.body);
  const user = await findUserById(orderInput.userId);

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const order = await createOrder(orderInput);

  response.status(201).json({
    message: 'Order created successfully.',
    order,
  });
}

export async function listUserOrdersController(request: Request, response: Response) {
  const userId = validateUserId(String(request.params.userId));
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const orders = await listOrdersByUser(userId);

  response.json(orders);
}
