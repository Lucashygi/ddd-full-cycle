import Product from '../entity/product';

export default class ProductService {
    static increasePRice(products: Product[], percentage: number): void {
        products.forEach((product) => {
            product.changePrice(
                product.price + (product.price * percentage) / 100
            );
        });
    }
}
