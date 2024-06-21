import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ItemCart } from '../../models/itemcart.model';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ItemOrder } from '../../models/itemorder.model';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  itens: ItemCart[] = [];
  currentDate = new Date();
  itemOrder: ItemOrder[] = [];
  user: any;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe( itens => {
      this.itens = itens;
    })
    this.carregarUsuario();
  }

  removerTudo(){
    this.cartService.removerTudo();
  }

  removerItem(item: ItemCart): void {
    this.cartService.remover(item);
  }

  increaseQuantity(item: ItemCart) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: ItemCart) {
    this.cartService.decreaseQuantity(item);
  }

  finalizarCompra(){
    this.router.navigateByUrl(`/finish-order`)
  }

  continuarComprando(): void {
    if (this.user === null) {
      this.router.navigateByUrl('/products');
    } else if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl('/admin/products');
    } else {
      this.router.navigateByUrl('/products');
    } 
  }

  carregarUsuario() {
    this.authService.getUsuarioLogado().subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    );
  }

  calcularTotal(): number {
    return this.itens.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  lerMais(id: number){
    if (this.user === null) {
      this.router.navigateByUrl(`/manga/${id}`);
    } else if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/manga/${id}`);
    } else {
      this.router.navigateByUrl(`/manga/${id}`);
    } 
    
  }

}