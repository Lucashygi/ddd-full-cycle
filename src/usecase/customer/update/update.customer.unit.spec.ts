import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import UpdateCustomerUseCase from './update.customer.usecase';

const customer = CustomerFactory.createWithAddress(
    'John',
    new Address('Street 1', 1, 'zip', 'city')
);

const input = {
    id: customer.id,
    name: 'Jane',
    address: {
        street: 'Street 2',
        number: 2,
        zip: 'zip',
        city: 'city',
    },
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
};

describe('Unit test when customer is updated use case', () => {
    it('should update a customer', async () => {
        const customerRepository = MockRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);

        const result = await usecase.execute(input);

        expect(result).toEqual(input);
    });

    it('should throw an error when name is missing', async () => {
        const customerRepository = MockRepository();

        const usecase = new UpdateCustomerUseCase(customerRepository);
        input.name = '';
        await expect(usecase.execute(input)).rejects.toThrowError(
            'customer name is required'
        );
    });
});
