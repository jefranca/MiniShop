import { categorySeed } from './data/categories.js';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { productSeed } from './data/products.js';
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
    expect(response.body).toHaveLength(productSeed.length);
    expect(response.body[0]).toMatchObject({
      id: 1,
      name: 'Jaqueta Atlas',
      category: 'Moda',
    });
  });

  it('lista categorias disponiveis', async () => {
    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(categorySeed.length);
    expect(response.body[0]).toMatchObject({
      name: 'Casa',
    });
  });

  it('cria uma nova categoria', async () => {
    const response = await request(app).post('/api/categories').send({
      name: 'Escritorio',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Escritorio',
    });
  });

  it('cria um novo usuario com senha protegida', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      name: 'Jefferson Franca',
      email: 'jefferson@email.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'User created successfully.',
      user: expect.objectContaining({
        id: expect.any(Number),
        name: 'Jefferson Franca',
        email: 'jefferson@email.com',
      }),
    });
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it('retorna 409 ao tentar criar usuario com email repetido', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Jefferson Franca',
      email: 'jefferson@email.com',
      password: '123456',
    });

    const response = await request(app).post('/api/auth/signup').send({
      name: 'Jefferson Franca',
      email: 'jefferson@email.com',
      password: '123456',
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: 'User already exists with this email.',
    });
  });

  it('faz login com credenciais validas', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Jefferson Franca',
      email: 'jefferson@email.com',
      password: '123456',
    });

    const response = await request(app).post('/api/auth/signin').send({
      email: 'jefferson@email.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Sign in successful.',
      user: expect.objectContaining({
        id: expect.any(Number),
        name: 'Jefferson Franca',
        email: 'jefferson@email.com',
      }),
    });
  });

  it('retorna 400 ao tentar login com senha invalida', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Jefferson Franca',
      email: 'jefferson@email.com',
      password: '123456',
    });

    const response = await request(app).post('/api/auth/signin').send({
      email: 'jefferson@email.com',
      password: 'senha-errada',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Invalid email or password.',
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

  it('retorna 400 ao tentar criar produto com categoria inexistente', async () => {
    const response = await request(app).post('/api/products').send({
      name: 'Produto sem categoria valida',
      category: 'Inexistente',
      price: 10,
      image: 'x',
      description: 'Teste.',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Category does not exist.',
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

    expect(listResponse.body).toHaveLength(productSeed.length - 1);
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
