export default interface ProductInterface {
    id: string;
    name: string;
    price: number;

    validate(): void;

    changeName(name: string): string;

    changePrice(price: number): number;
}
