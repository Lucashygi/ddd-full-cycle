import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import ListCustomerUseCase from './list.customer.usecase';

const customer1 = CustomerFactory.createWithAddress(
    'John',
    new Address('Street 1', 1, 'zip', 'city')
);

const customer2 = CustomerFactory.createWithAddress(
    'Jane',
    new Address('Street 2', 2, 'zip', 'city')
);

const MockRepository = () => {
    return {
        find: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findAll: jest
            .fn()
            .mockReturnValue(Promise.resolve([customer1, customer2])),
    };
};

describe('Unit test for listing customer use case', () => {
    it('should list all customers', async () => {
        const customerRepository = MockRepository();
        const usecase = new ListCustomerUseCase(customerRepository);
        const result = await usecase.execute();
        expect(result.customers.length).toBe(2);
        expect(result.customers[0].id).toBe(customer1.id);
        expect(result.customers[0].name).toBe(customer1.name);
        expect(result.customers[0].address.street).toBe(
            customer1.Address.street
        );
        expect(result.customers[1].id).toBe(customer2.id);
        expect(result.customers[1].name).toBe(customer2.name);
        expect(result.customers[1].address.street).toBe(
            customer2.Address.street
        );
    });
});
