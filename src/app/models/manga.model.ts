import { Collection } from "./collection.model";
import { Publisher } from "./publisher.model";
import { Author } from "./author.model";
import { Genre } from "./genre.model";

export class Manga {
    id!: number;
    name!: string
    description!: String
    price!: number
    quantity!: number
    inventory!: number
    numPages!: number
    volume!: number
    collection!: Collection
    publisher!: Publisher
    imageName!: string;
    author!: Author
    listGenre!: Genre[]
}
