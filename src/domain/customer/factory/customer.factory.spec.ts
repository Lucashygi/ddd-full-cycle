import Address from '../value-object/address';
import CustomerFactory from './customer.factory';

describe('Customer factory unit tests', () => {
    it('should create a customer', () => {
        let customer = CustomerFactory.create('John');

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe('John');
        expect(customer.Address).toBeUndefined();
    });

    it('should create a customer with an address', () => {
        const address = new Address('Rua 1', 1, '00000000', 'Belo Horizonte');
        let customer = CustomerFactory.createWithAddress('John', address);
    });
});
