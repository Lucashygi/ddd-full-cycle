import Address from '../../customer/value-object/address';
import Customer from '../../customer/entity/customer';
import EventDispatcher from './event-dispatcher';
import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created';
import ProductCreatedEvent from '../../product/event/product-created.event';
import SendFirstInfoWhenCustomerIsCreatedHandler from '../../customer/event/handler/send-first-info-when-customer-is-created';
import SendSecondInfoWhenCustomerIsCreatedHandler from '../../customer/event/handler/send-second-info-when-customer-is-created';
import CustomerCreatedEvent from '../../customer/event/customer-created.event';
import SendInfoWhenCustomerAddressIsChangedHandler from '../../customer/event/handler/send-info-when-customer-address-is-changed';
import CustomerAddressChangedEvent from '../../customer/event/customer-address-changed.event';

describe('Domain events tests', () => {
    it('should register an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent']
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent'].length
        ).toBe(1);
        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
        ).toMatchObject(eventHandler);
    });

    it('should unregister an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
        ).toMatchObject(eventHandler);

        eventDispatcher.unregister('ProductCreatedEvent', eventHandler);
        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent']
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent'].length
        ).toBe(0);
    });

    it('should unregister all events', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
        ).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();
        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent']
        ).toBeUndefined();
    });

    it('should notify all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(
            eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]
        ).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: 'Product 1',
            description: 'Product description',
            price: 10,
        });

        // Quando notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deverá ser executado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it('should notify all event handlers in customer case', () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler =
            new SendFirstInfoWhenCustomerIsCreatedHandler();
        const secondEventHandler =
            new SendSecondInfoWhenCustomerIsCreatedHandler();

        const spyEventHandler1 = jest.spyOn(firstEventHandler, 'handle');
        const spyEventHandler2 = jest.spyOn(secondEventHandler, 'handle');

        eventDispatcher.register('CustomerCreatedEvent', firstEventHandler);
        eventDispatcher.register('CustomerCreatedEvent', secondEventHandler);
        const customer = new Customer('1', 'Zeca');

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customer.id,
            name: customer.name,
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it('should notify all event handlers in customer change address case', () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler =
            new SendFirstInfoWhenCustomerIsCreatedHandler();
        const secondEventHandler =
            new SendSecondInfoWhenCustomerIsCreatedHandler();
        const addressEventHandler =
            new SendInfoWhenCustomerAddressIsChangedHandler();

        const spyEventHandler1 = jest.spyOn(firstEventHandler, 'handle');
        const spyEventHandler2 = jest.spyOn(secondEventHandler, 'handle');
        const spyEventHandlerAddress = jest.spyOn(
            addressEventHandler,
            'handle'
        );
        eventDispatcher.register('CustomerCreatedEvent', firstEventHandler);
        eventDispatcher.register('CustomerCreatedEvent', secondEventHandler);
        eventDispatcher.register(
            'CustomerAddressChangedEvent',
            addressEventHandler
        );

        const customer = new Customer('1', 'Zeca');

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: customer.id,
            name: customer.name,
        });

        customer.changeAddress(
            new Address('Rua Sao Jose', 1, '123456789', 'Desconhecida')
        );
        const customerAddressEvent = new CustomerAddressChangedEvent({
            id: customer.id,
            name: customer.name,
            Address: customer.Address,
        });

        eventDispatcher.notify(customerCreatedEvent);
        eventDispatcher.notify(customerAddressEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
        expect(spyEventHandlerAddress).toHaveBeenCalled();
    });
});
