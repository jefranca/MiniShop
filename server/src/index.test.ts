import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from './index';
import { resetProducts } from './services/productService';

describe('MiniShop API', () => {
  beforeEach(() => {
    resetProducts();
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
});
