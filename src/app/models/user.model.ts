import { Address } from "./address.model";
import { Profile } from "./profile.model";

export class User {
    id!: number;
    name!: string
    email!: String
    cpf!: String
    password!: string
    profile!: Profile
    imageName!: string;
    address!: Address;
}
