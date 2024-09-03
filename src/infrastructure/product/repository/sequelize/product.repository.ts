import RepositoryInterface from '../../../../domain/@shared/repository/repository-interface';
import Product from '../../../../domain/product/entity/product';
import ProductInterface from '../../../../domain/product/entity/product.interface';
import ProductModel from './product.model';

export default class ProductRepository
    implements RepositoryInterface<ProductInterface>
{
    async create(entity: ProductInterface): Promise<void> {
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price,
        });
    }
    async update(entity: ProductInterface): Promise<void> {
        await ProductModel.update(
            {
                name: entity.name,
                price: entity.price,
            },
            {
                where: {
                    id: entity.id,
                },
            }
        );
    }
    async find(id: string): Promise<ProductInterface> {
        const productModel = await ProductModel.findOne({
            where: {
                id,
            },
        });
        return new Product(
            productModel.id,
            productModel.name,
            productModel.price
        );
    }
    async findAll(): Promise<ProductInterface[]> {
        const products = await ProductModel.findAll();
        return products.map(
            (product) => new Product(product.id, product.name, product.price)
        );
    }
}
