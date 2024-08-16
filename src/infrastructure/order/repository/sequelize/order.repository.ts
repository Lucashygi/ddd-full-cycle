import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import RepositoryInterface from '../../../../domain/@shared/repository/repository-interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export class OrderRepository implements RepositoryInterface<Order> {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }
    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                where: {
                    id: entity.id,
                },
            }
        );
    }
    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: { id },
                include: ['items'],
                rejectOnEmpty: true,
            });
        } catch {
            throw new Error('Order not found');
        }

        const items = orderModel.items.map((item) => {
            const orderItem = new OrderItem(
                item.id,
                item.product_id,
                item.name,
                item.price,
                item.quantity
            );
            return orderItem;
        });
        const order = new Order(orderModel.id, orderModel.customer_id, items);
        return order;
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: ['items'],
        });

        const orders = await orderModels.map((orderModel) => {
            const items = orderModel.items.map((item) => {
                const orderItem = new OrderItem(
                    item.id,
                    item.product_id,
                    item.name,
                    item.price,
                    item.quantity
                );
                return orderItem;
            });
            const order = new Order(
                orderModel.id,
                orderModel.customer_id,
                items
            );
            return order;
        });

        return orders;
    }
}
