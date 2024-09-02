import CreateProductUseCase from './create.product.usecase';

const input = {
    type: 'a',
    name: 'Product 1',
    price: 10,
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit test create product use case', () => {
    it('should create a product', async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: 'Product 1',
            price: 10,
        });
    });
});
