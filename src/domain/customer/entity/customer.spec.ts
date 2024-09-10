import Address from '../value-object/address';
import Customer from './customer';

describe('Customer unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            let customer = new Customer('', 'Lucas');
        }).toThrowError('customer: Id is required');
    });

    it('should throw error when name is empty', () => {
        expect(() => {
            let customer = new Customer('123', '');
        }).toThrowError('customer: Name is required');
    });

    it('should throw error when id and name are empty', () => {
        expect(() => { 
            let customer = new Customer('', '');
    }).toThrowError("customer: Id is required\ncustomer: Name is required");

    it('should change name', () => {
        const customer = new Customer('123', 'Lucas');
        customer.changeName('John');
        expect(customer.name).toBe('John');
    });

    it('should add reward points', () => {
        const customer = new Customer('123', 'Lucas');
        expect(customer.rewardPoints).toBe(0);
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

    it('should throw error when change name to empty', () => {
        expect(() => {
            const customer = new Customer('123', 'Lucas');
            customer.changeName('');
        }).toThrowError('customer name is required');
    });

    it('should activate customer', () => {
        const customer = new Customer('123', 'Lucas');
        const address = new Address('Rua 1', 123, '12345-678', 'São Paulo');
        customer.changeAddress(address);
        customer.activate();
        expect(customer.isActive()).toBeTruthy();
    });

    it('should throw error when address is undefined to activate a customer', () => {
        expect(() => {
            const customer = new Customer('123', 'Lucas');
            customer.activate();
        }).toThrowError('Address is mandatory to activate a customer');
    });
});
