import Address from '../value-object/address';

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate() {
        if (!this.id) {
            throw new Error('customer id is required');
        }
        if (!this.name) {
            throw new Error('customer name is required');
        }
    }
    get id(): string {
        return this._id;
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
