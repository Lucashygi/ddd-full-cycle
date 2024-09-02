import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import UpdateProductUseCase from './update.product.usecase';
import Product from '../../../domain/product/entity/product';

describe('Test update product use case', () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    it('should update a product', async () => {
        const productRepository = new ProductRepository();

        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        product.changeName('Product 2');
        product.changePrice(20);

        const usecase = new UpdateProductUseCase(productRepository);

        const result = await usecase.execute(product);

        expect(result).toEqual({
            id: expect.any(String),
            name: product.name,
            price: product.price,
        });
    });
});
