import ProductFactory from '../../../domain/product/factory/product.factory';
import UpdateProductUseCase from './update.product.usecase';

const product = ProductFactory.create('a', 'Product 1', 10);

const input = {
    id: product.id,
    name: 'Product 2',
    price: 20,
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    };
};

describe('Unit tests for update products', () => {
    it('should update a product', async () => {
        const productRepository = MockRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const result = await usecase.execute(input);

        expect(result).toEqual(input);
    });
});
