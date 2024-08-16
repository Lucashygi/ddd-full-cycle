import Customer from '../entity/customer';
import Order from '../entity/order';
import OrderItem from '../entity/order_item';
import OrderService from './order.service';

describe('Order Service unit tests', () => {
    it('should place an order', () => {
        const customer = new Customer('123', 'Lucas');
        const item1 = new OrderItem('1', '1', 'Item 1', 100, 1);

        const order = OrderService.placeOrder(customer, [item1]);
        expect(customer.rewardPoints).toBe(50);
        expect(order.total()).toBe(100);
    });

    it('should get total of all orders', () => {
        const OrderItem1 = new OrderItem('1', '1', 'Item 1', 100, 1);
        const orderItem2 = new OrderItem('2', '2', 'Item 2', 200, 1);

        const order1 = new Order('1', '123', [OrderItem1]);
        const order2 = new Order('2', '123', [orderItem2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(300);
    });
});
