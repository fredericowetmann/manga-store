import { Address } from "./address.model";
import { ItemOrder } from "./itemorder.model";
import { Payment } from "./payment.model";

export class Order {
  id!: number;
  itens!: ItemOrder[];
  dataHora!: Date;
  totalOrder!: number;
  payment!: Payment;
  address!: Address;
}