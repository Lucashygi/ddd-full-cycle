import Address from '../../entity/address';
import EventInterface from '../@shared/event.interface';

export default class CustomerAddressChangedEvent implements EventInterface {
    dateTimeOccured: Date;
    eventData: any;
    id: string;
    name: string;
    Address: Address;

    constructor(eventData: any) {
        this.dateTimeOccured = new Date();
        this.eventData = eventData;
        this.id = eventData.id;
        this.name = eventData.name;
        this.Address = eventData.Address;
    }
}
