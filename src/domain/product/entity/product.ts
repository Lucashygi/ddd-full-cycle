import Entity from '../../@shared/entity/entity.abstract';
import Notification from '../../@shared/notification/notification';
import NotificationError from '../../@shared/notification/notification.error';
import ProductValidatorFactory from '../factory/product.validator.factory';
import ProductInterface from './product.interface';

export default class Product extends Entity implements ProductInterface {
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        super();
        this._id = id;
        this._name = name;
        this._price = price;
        this.validate();
    }

    validate() {
        ProductValidatorFactory.create().validate(this);
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
        return true;
    }

    changeName(name: string): string {
        this._name = name;
        this.validate();
        return this._name;
    }

    get name(): string {
        return this._name;
    }

    changePrice(price: number): number {
        this._price = price;
        this.validate();
        return this._price;
    }

    get price(): number {
        return this._price;
    }

    get id(): string {
        return this._id;
    }
}
