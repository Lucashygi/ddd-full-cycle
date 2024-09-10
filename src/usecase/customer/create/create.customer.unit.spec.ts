import CreateCustomerUseCase from './create.customer.usecase';

const input = {
    name: 'John',
    address: {
        street: 'Street 1',
        number: 123,
        zip: 'zip',
        city: 'city',
    },
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit test create customer use case', () => {
    it('should create a customer', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(
            customerRepository
        );

        const result = await customerCreateUseCase.execute(input);
        const output = {
            id: expect.any(String),
            name: 'John',
            address: {
                street: 'Street 1',
                number: 123,
                zip: 'zip',
                city: 'city',
            },
        };
        expect(output).toEqual(result);
    });
    it('should throw an error when name is missing', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(
            customerRepository
        );
        input.name = '';
        await expect(customerCreateUseCase.execute(input)).rejects.toThrowError(
            'customer: Name is required'
        );
    });

    it('should throw an error when address is missing', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(
            customerRepository
        );
        input.address.street = '';
        await expect(customerCreateUseCase.execute(input)).rejects.toThrowError(
            'street is required'
        );
    });
});
