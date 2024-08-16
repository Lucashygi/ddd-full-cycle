import Order from './order';
import OrderItem from './order_item';

describe('Order unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            let order = new Order('', '123', []);
        }).toThrowError('Id is required');
    });

    it('should throw error when customerId is empty', () => {
        expect(() => {
            let order = new Order('123', '', []);
        }).toThrowError('customerId is required');
    });

    it('should throw error when items is empty', () => {
        expect(() => {
            let order = new Order('123', '123', []);
        }).toThrowError('Items quantity must be greater than 0');
    });

    it('should calculate total', () => {
        const order = new Order('123', '123', [
            new OrderItem('1', '1', 'Item 1', 100, 1),
            new OrderItem('2', '2', 'Item 2', 200, 1),
            new OrderItem('3', '3', 'Item 3', 300, 1),
        ]);
        expect(order.total()).toBe(600);

        const order2 = new Order('123', '123', [
            new OrderItem('1', '1', 'Item 1', 100, 3),
        ]);
        expect(order2.total()).toBe(300);
    });

    it('should throw error when quantity is less or equal zero', () => {
        expect(() => {
            const order = new Order('123', '123', [
                new OrderItem('1', '1', 'Item 1', 100, 0),
            ]);
        }).toThrowError('Quantity must be greater than zero');
    });
});
