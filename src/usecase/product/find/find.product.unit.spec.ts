import ProductFactory from '../../../domain/product/factory/product.factory';
import FindProductUseCase from './find.product.usecase';

const product = ProductFactory.create('a', 'Product A', 10);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    };
};

describe('Unit test for find product use case', () => {
    it('should find a product', async () => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);
        const input = {
            id: '1',
        };
        const output = await usecase.execute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: 'Product A',
            price: 10,
        });
    });

    it('should throw an error when product not find', async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error('Product not found');
        });
        const usecase = new FindProductUseCase(productRepository);
        const input = {
            id: 'abc',
        };

        await expect(usecase.execute(input)).rejects.toThrowError(
            'Product not found'
        );
    });
});
