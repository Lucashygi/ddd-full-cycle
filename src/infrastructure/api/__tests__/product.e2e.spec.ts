import { app, sequelize } from '../express';
import request from 'supertest';

describe('End to End test for product', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const response = await request(app).post('/product').send({
            type: 'a',
            name: 'Product 1',
            price: 200,
        });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Product 1');
        expect(response.body.price).toBe(200);
    });

    it('should not create a product', async () => {
        const response = await request(app).post('/product').send({
            name: 'Product 1',
        });
        expect(response.status).toBe(500);
    });

    it('should list all products', async () => {
        const response1 = await request(app).post('/product').send({
            type: 'a',
            name: 'Feijao',
            price: 10,
        });

        const response2 = await request(app).post('/product').send({
            type: 'b',
            name: 'Abacate',
            price: 8,
        });

        const listResponse = await request(app).get('/product').send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product1 = listResponse.body.products[0];
        expect(product1.name).toBe(response1.body.name);
        expect(product1.price).toBe(response1.body.price);
        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe(response2.body.name);
        expect(product2.price).toBe(response2.body.price);
    });
});
