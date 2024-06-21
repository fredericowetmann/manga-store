import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { ItemCart } from '../models/itemcart.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/orders';

  private cartSubject = new BehaviorSubject<ItemCart[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(
              private localStorageService: LocalStorageService,
              private httpClient: HttpClient
            ){
    const cartArmazenado = localStorageService.getItem('cart') || [];
    this.cartSubject.next(cartArmazenado);
  }

  adicionar(manga: ItemCart): void {
    const cartAtual = this.cartSubject.value;
    const itemExistente = cartAtual.find(item => item.id === manga.id);

    if (itemExistente) {
      itemExistente.quantity += manga.quantity || 1;
    } else {
      cartAtual.push({ ...manga });
    }

    this.cartSubject.next(cartAtual);
    this.atualizarArmazenamentoLocal();
  }

  removerTudo(): void {
    this.localStorageService.removeItem('cart');
    window.location.reload();
  }

  removerTudoAsk(): void {
    if (confirm('Tem certeza que deseja remover esse produto do carrinho?')) {
    this.localStorageService.removeItem('cart');
    window.location.reload(); // reload na página
    }
  }

  remover(item: ItemCart): void {
    const cartAtual = this.cartSubject.value;
    const cartAtualizado = cartAtual.filter(itemCart => itemCart !== item);

    if (confirm('Tem certeza que deseja remover esse produto do carrinho?')) {
      this.cartSubject.next(cartAtualizado);
    }
    this.atualizarArmazenamentoLocal();
  }

  increaseQuantity(manga: ItemCart): void {
    const cartAtual = this.cartSubject.value;
    const itemIndex = cartAtual.findIndex(itemCart => itemCart.id === manga.id);

    if (itemIndex !== -1) {
      const item = cartAtual[itemIndex];
      item.quantity += 1;
      const cartAtualizado = [...cartAtual];
      cartAtualizado[itemIndex] = item;
      this.cartSubject.next(cartAtualizado);
    }

    this.atualizarArmazenamentoLocal();
  }

  decreaseQuantity(manga: ItemCart): void {
    const cartAtual = this.cartSubject.value;
    const itemIndex = cartAtual.findIndex(itemCart => itemCart.id === manga.id);

    if (itemIndex !== -1) {
      const item = cartAtual[itemIndex];

      if (item.quantity > 1) {
        item.quantity -= 1;
        const cartAtualizado = [...cartAtual];
        cartAtualizado[itemIndex] = item;
        this.cartSubject.next(cartAtualizado);
      } else {
        if (confirm('Tem certeza que deseja remover esse produto do carrinho?')) {
          this.remover(manga);
        }
      }
    }
    this.atualizarArmazenamentoLocal();
  }

  insert(itemOrder: any, payment: any): void {
    const AddressDTO = {
      name: payment.addressName,
      postalCode: payment.addressPostalCode,
      address: payment.addressAddress,
      complement: payment.addressComplement,
      city: payment.addressCity.id
    }
    const paymentDTO = {
      cardNumber: payment.cardNumber,
      cardHolderName: payment.cardHolderName,
      cardExpiration: payment.cardExpiration,
      cardCvv: payment.cardCvv,
      amount: itemOrder.total
    }
    const order = {
      payment: paymentDTO,
      itens: itemOrder,
      address: AddressDTO
    }
    console.log(order)
    this.httpClient.post(`${this.baseUrl}/insert`, order).subscribe(
      () => {
        this.removerTudo();
      }
    );
  }

  // insert(itemOrder: any, payment: any): void {
  //   const paymentDTO = {
  //     cardNumber: payment.cardNumber,
  //     cardHolderName: payment.cardHolderName,
  //     cardExpiration: payment.cardExpiration,
  //     cardCvv: payment.cardCvv,
  //     amount: itemOrder.total
  //   }
  //   const order = {
  //     payment: paymentDTO,
  //     itens: itemOrder
  //   }
  //   console.log(order)
  //   this.httpClient.post(`${this.baseUrl}/insert`, order).subscribe(
  //     () => {
  //       this.removerTudo();
  //     }
  //   );
  // }

  obter(): ItemCart[] {
    return this.cartSubject.value;
  }

  private atualizarArmazenamentoLocal(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }
}
