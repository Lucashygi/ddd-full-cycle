import Entity from '../../@shared/entity/entity.abstract';
import NotificationError from '../../@shared/notification/notification.error';
import Address from '../value-object/address';

export default class Customer extends Entity {
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate() {
        if (!this.id) {
            this.notification.addError({
                message: 'Id is required',
                context: 'customer',
            });
        }
        if (!this._name) {
            this.notification.addError({
                message: 'Name is required',
                context: 'customer',
            });
        }
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }
    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    get Address(): Address {
        return this._address;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error('Address is mandatory to activate a customer');
        }
        this._active = true;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    deactivate() {
        this._active = false;
    }

    isActive() {
        return this._active;
    }
}
