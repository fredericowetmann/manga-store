import { City } from "./city.model";

export class Address {
    name!: string;
    postalCode!: string;
    address!: string;
    complement!: string;
    city!: City;
}