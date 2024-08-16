import Address from '../../domain/entity/address';
import Customer from '../../domain/entity/customer';
import RepositoryInterface from '../../domain/repository/repository-interface';
import CustomerModel from '../db/sequelize/model/customer.model';

export default class CustomerRepository
    implements RepositoryInterface<Customer>
{
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.Address.street,
            number: entity.Address.number,
            city: entity.Address.city,
            zip: entity.Address.zip,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.Address.street,
                number: entity.Address.number,
                city: entity.Address.city,
                zip: entity.Address.zip,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            {
                where: {
                    id: entity.id,
                },
            }
        );
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({
                where: { id },
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error('Customer not found');
        }
        const customer = new Customer(customerModel.id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zip,
            customerModel.city
        );
        customer.changeAddress(address);
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        const customers = customerModels.map((customerModel) => {
            let customer = new Customer(customerModel.id, customerModel.name);
            customer.changeAddress(
                new Address(
                    customerModel.street,
                    customerModel.number,
                    customerModel.zip,
                    customerModel.city
                )
            );
            customer.addRewardPoints(customerModel.rewardPoints);
            if (customerModel.active) {
                customer.activate();
            }
            return customer;
        });

        return customers;
    }
}
