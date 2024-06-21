import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatBadge, MatButton, MatIconButton, RouterModule, CommonModule, FormsModule],
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  usuarioLogado: User | null = null;
  private subscription = new Subscription();
  showLoginOptions: boolean = false;
  showCart: boolean = false;
  qtdItensCart: number = 0;
  searchQuery: string = '';
  genericImage = 'assets/images/default-profile.jpg';
  logo = 'assets/images/logo.png';
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obterQtdItensCart();
    this.getUsuarioLogado();
    this.loadCartItems();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.searchQuery = this.searchQuery.trim()
    if (this.searchQuery) {
      this.router.navigate(['/search/name'], { queryParams: { q: this.searchQuery } });
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  obterQtdItensCart() {
    this.subscription.add(this.cartService.cart$.subscribe(itens => {
      this.qtdItensCart = itens.reduce((total, item) => total + item.quantity, 0);
      this.cartItems = itens;
      this.calculateTotalPrice();
    }));
  }

  loadCartItems() {
    this.subscription.add(this.cartService.cart$.subscribe(itens => {
      this.cartItems = itens;
      this.calculateTotalPrice();
    }));
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  getUsuarioLogado() {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      user => this.usuarioLogado = user
    ));
  }

  getImageUrl(id: number) {
    return this.userService.getUrlImagem(id);
  }

  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.cartService.removerTudo();
  }

  dashboard() {
    this.router.navigateByUrl(`/profile/`);
  }

  increaseQuantity(item: any) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: any) {
    this.cartService.decreaseQuantity(item);
  }

  removeItem(item: any) {
    this.cartService.remover(item);
  }

  goToCart() {
    this.router.navigate(['/cart']);
    this.showCart = false;
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.cart-dropdown')) {
      this.showCart = false;
    }
  }
}
