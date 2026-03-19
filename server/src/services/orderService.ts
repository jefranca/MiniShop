import { prisma } from '../lib/prisma.js';
import type { OrderInput, OrderSummary } from '../types/order.js';

export async function createOrder(input: OrderInput) {
  const order = await prisma.order.create({
    data: {
      userId: input.userId,
      customerName: input.customerName,
      email: input.email,
      cep: input.cep,
      street: input.street,
      number: input.number,
      neighborhood: input.neighborhood,
      city: input.city,
      state: input.state,
      paymentMethod: input.paymentMethod,
      subtotal: input.subtotal,
      shipping: input.shipping,
      discount: input.discount,
      total: input.total,
      items: {
        create: input.items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          description: item.description,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return order as unknown as OrderSummary;
}

export async function listOrdersByUser(userId: number) {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
      description: item.description,
    })),
  })) as OrderSummary[];
}

export async function resetOrders() {
  await prisma.order.deleteMany();
}
