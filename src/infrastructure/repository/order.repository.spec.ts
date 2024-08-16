import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';
import CustomerRepository from './customer.repository';
import Customer from '../../domain/entity/customer';
import Address from '../../domain/entity/address';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import ProductModel from '../db/sequelize/model/product.model';
import ProductRepository from './product.repository';
import Product from '../../domain/entity/product';
import OrderItem from '../../domain/entity/order_item';
import Order from '../../domain/entity/order';
import { OrderRepository } from './order.repository';

describe('Order repository test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    it('should create a new order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.id,
            product.name,
            product.price,
            2
        );

        const order = new Order('1', customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: '1' },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: '1',
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.productId,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                },
            ],
        });
    });

    it('should update an order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.id,
            product.name,
            product.price,
            2
        );

        const order = new Order('1', customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        let orderModel = await OrderModel.findOne({
            where: { id: '1' },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: '1',
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.productId,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                },
            ],
        });
        const product2 = new Product('2', 'Product 2', 200);
        await productRepository.create(product2);
        const orderItem2 = new OrderItem(
            '2',
            product2.id,
            product2.name,
            product2.price,
            2
        );

        order.addItems([orderItem2]);
        await orderRepository.update(order);

        orderModel = await OrderModel.findOne({
            where: { id: '1' },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: '1',
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.productId,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                },
            ],
        });
    });

    it('should find an order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.id,
            product.name,
            product.price,
            2
        );

        const order = new Order('1', customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);
        expect(foundOrder).toStrictEqual(order);
    });

    it('should find all orders', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Lucas');
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        customer.changeAddress(address);
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        const orderItem = new OrderItem(
            '1',
            product.id,
            product.name,
            product.price,
            2
        );
        const order = new Order('1', customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await customerRepository.create(customer);
        await productRepository.create(product);
        await orderRepository.create(order);

        let foundOrders = await orderRepository.findAll();
        expect(foundOrders).toStrictEqual([order]);

        const customer2 = new Customer('2', 'João');
        customer2.changeAddress(address);
        const product2 = new Product('2', 'Product 2', 200);
        const orderItem2 = new OrderItem(
            '2',
            product2.id,
            product2.name,
            product2.price,
            2
        );
        const order2 = new Order('2', customer2.id, [orderItem2]);
        await customerRepository.create(customer2);
        await productRepository.create(product2);
        await orderRepository.create(order2);

        foundOrders = await orderRepository.findAll();
        expect(foundOrders).toStrictEqual([order, order2]);
    });

    it('should throw an Error when order not found', async () => {
        const orderRepository = new OrderRepository();
        expect(async () => {
            await orderRepository.find('2');
        }).rejects.toThrow('Order not found');
    });
});
