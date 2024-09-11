import Notification from './notification';

describe('Unit tests for notifications', () => {
    it('should create errors for customers', () => {
        const notification = new Notification();
        const error = {
            message: 'error message',
            context: 'customer',
        };

        notification.addError(error);

        expect(notification.messages('customer')).toEqual(
            'customer: error message'
        );

        const error2 = {
            message: 'error message 2',
            context: 'customer',
        };

        notification.addError(error2);

        expect(notification.messages('customer')).toEqual(
            'customer: error message\ncustomer: error message 2'
        );
    });

    it('should check if notification has customer errors', () => {
        const notification = new Notification();
        const error = {
            message: 'error message',
            context: 'customer',
        };

        notification.addError(error);
        expect(notification.hasErrors()).toBeTruthy();
    });
    it('should get all errors props', () => {
        const notification = new Notification();
        const error = {
            message: 'error message',
            context: 'customer',
        };

        notification.addError(error);

        expect(notification.getErrors()).toEqual([error]);
    });
    it('should create errors for products', () => {
        const notification = new Notification();
        const error = {
            message: 'error message',
            context: 'product',
        };

        notification.addError(error);

        expect(notification.messages('product')).toEqual(
            'product: error message'
        );

        const error2 = {
            message: 'error message 2',
            context: 'customer',
        };

        notification.addError(error2);

        expect(notification.messages('customer')).toEqual(
            'customer: error message 2'
        );
    });
});
