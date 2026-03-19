import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from './index.js';
import { resetProducts } from './services/productService.js';

describe('MiniShop API', () => {
  beforeEach(async () => {
    await resetProducts();
  });

  it('retorna status de saude da API', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'MiniShop API',
    });
  });

  it('lista produtos do catalogo', async () => {
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(6);
    expect(response.body[0]).toMatchObject({
      id: 1,
      name: 'Jaqueta Atlas',
      category: 'Moda',
    });
  });

  it('retorna um produto especifico por id', async () => {
    const response = await request(app).get('/api/products/2');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      name: 'Fone Pulse Mini',
      category: 'Tecnologia',
    });
  });

  it('retorna 404 quando o produto nao existe', async () => {
    const response = await request(app).get('/api/products/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Product not found.',
    });
  });

  it('cria um novo produto', async () => {
    const response = await request(app).post('/api/products').send({
      name: 'Mesa Lume',
      category: 'Casa',
      price: 349.9,
      image: '[table]',
      description: 'Mesa compacta com acabamento natural para ambientes modernos.',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Mesa Lume',
      category: 'Casa',
      price: 349.9,
    });
    expect(response.body.id).toBeTypeOf('number');
  });

  it('retorna 400 ao tentar criar produto com payload incompleto', async () => {
    const response = await request(app).post('/api/products').send({
      name: 'Produto incompleto',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Name, category, price, image and description are required.',
    });
  });

  it('atualiza um produto existente', async () => {
    const response = await request(app).put('/api/products/2').send({
      name: 'Fone Pulse Pro',
      category: 'Tecnologia',
      price: 219.9,
      image: '[headphones-pro]',
      description: 'Versao atualizada com audio mais potente e melhor autonomia.',
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      name: 'Fone Pulse Pro',
      price: 219.9,
    });
  });

  it('retorna 404 ao tentar atualizar um produto inexistente', async () => {
    const response = await request(app).put('/api/products/999').send({
      name: 'Produto fantasma',
      category: 'Tecnologia',
      price: 99.9,
      image: '[ghost]',
      description: 'Nao deveria existir.',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Product not found.',
    });
  });

  it('remove um produto existente', async () => {
    const deleteResponse = await request(app).delete('/api/products/2');

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      message: 'Product deleted successfully.',
      product: expect.objectContaining({
        id: 2,
        name: 'Fone Pulse Mini',
      }),
    });

    const listResponse = await request(app).get('/api/products');

    expect(listResponse.body).toHaveLength(5);
    expect(listResponse.body.find((product: { id: number }) => product.id === 2)).toBeUndefined();
  });

  it('retorna 404 ao tentar remover um produto inexistente', async () => {
    const response = await request(app).delete('/api/products/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Product not found.',
    });
  });
});
