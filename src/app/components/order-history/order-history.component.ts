// order-history.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CommonModule, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgFor, MatBadge, MatButton, MatIconButton, RouterModule, CommonModule, MatIcon],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
    orders: Order[] = [];
    user: any

  constructor(
            private orderService: OrderService,
            private authService: AuthService,
            private router: Router
        ){}
  UserId: number = 0;
  ngOnInit(): void {
    this.carregarUsuario()
    this.orderService.findByUser(this.user.id).subscribe(data => {
      this.orders = data;
    });
  }

  navegation(string: string): void {
    if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/profile/${string}`)
    } else {
      this.router.navigateByUrl(`profile/${string}`)
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

  viewOrderDetails(orderId: number): void {
    if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/order-details/${orderId}`)
    } else {
      this.router.navigateByUrl(`/order-details/${orderId}`)
    }
  }
}
