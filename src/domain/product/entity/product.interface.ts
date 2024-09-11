import Entity from '../../@shared/entity/entity.abstract';

export default interface ProductInterface extends Entity {
    name: string;
    price: number;

    validate(): void;

    changeName(name: string): string;

    changePrice(price: number): number;
}
