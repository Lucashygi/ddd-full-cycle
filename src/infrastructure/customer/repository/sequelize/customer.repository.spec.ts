import { Sequelize } from 'sequelize-typescript';
import CustomerModel from './customer.model';
import CustomerRepository from './customer.repository';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';

describe('Customer repository test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    it('should create a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: { id: '1' },
        });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zip: address.zip,
            city: address.city,
        });
    });

    it('should update a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        customer.changeName('João');
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({
            where: { id: '1' },
        });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zip: address.zip,
            city: address.city,
        });
    });

    it('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(foundCustomer);
    });

    it('should find all customers', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        customer.addRewardPoints(10);

        const customer2 = new Customer('2', 'Lelo');
        const address2 = new Address('Rua 2', 2, '00000000', 'Belo Horizonte');
        customer2.changeAddress(address2);
        customer2.addRewardPoints(200);

        customerRepository.create(customer);
        customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer);
        expect(customers).toContainEqual(customer2);
    });

    it('should throw an Error when customer not found', async () => {
        const customerRepository = new CustomerRepository();
        expect(async () => {
            await customerRepository.find('2');
        }).rejects.toThrow('Customer not found');
    });
});
