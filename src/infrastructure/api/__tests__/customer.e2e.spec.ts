import { app, sequelize } from '../express';
import request from 'supertest';

describe('End to End test for customer', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a customer', async () => {
        const response = await request(app)
            .post('/customer')
            .send({
                name: 'Customer 1',
                address: {
                    street: 'Street',
                    number: 400,
                    zip: 'zip',
                    city: 'city',
                },
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Customer 1');
        expect(response.body.address.street).toBe('Street');
        expect(response.body.address.number).toBe(400);
        expect(response.body.address.zip).toBe('zip');
        expect(response.body.address.city).toBe('city');
    });

    it('should not create a customer', async () => {
        const response = await request(app).post('/customer').send({
            name: 'Customer 1',
        });
        expect(response.status).toBe(500);
    });

    it('should list all customers', async () => {
        const response1 = await request(app)
            .post('/customer')
            .send({
                name: 'John',
                address: {
                    street: 'Street',
                    number: 400,
                    zip: 'zip',
                    city: 'city',
                },
            });

        const response2 = await request(app)
            .post('/customer')
            .send({
                name: 'Jane',
                address: {
                    street: 'Streeto',
                    number: 200,
                    zip: 'zip',
                    city: 'city',
                },
            });

        const listResponse = await request(app).get('/customer').send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);
        const customer1 = listResponse.body.customers[0];
        expect(customer1.name).toBe('John');
        expect(customer1.address.street).toBe('Street');
        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe('Jane');
        expect(customer2.address.street).toBe('Streeto');
    });
});
