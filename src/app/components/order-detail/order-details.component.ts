// order-details.component.ts
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model'; // Ajuste conforme seu modelo
import { Manga } from '../../models/manga.model'; // Ajuste conforme seu modelo
import { MangaService } from '../../services/manga.service';
import { CommonModule, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgFor, MatBadge, MatButton, MatIconButton, RouterModule, CommonModule, MatIcon],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
    order: Order | undefined;
    mangas: { [key: number]: Manga } = {};
  
    constructor(
      private route: ActivatedRoute,
      private orderService: OrderService,
      private mangaService: MangaService,
      private router: Router,
      private location: Location
    ) { }
  
    ngOnInit(): void {
      const orderId = +this.route.snapshot.paramMap.get('id')!;
      console.log('Order ID:', orderId); // Log para depuração
      this.orderService.getOrderById(orderId).subscribe(order => {
        this.order = order;
        console.log('Order details:', order); // Log para depuração
        console.log('Order itens:', order.itens); // Log para depuração adicional
        if (Array.isArray(order.itens)) {
          order.itens.forEach(item => {
            console.log('Fetching manga with ID:', item.idManga); // Log para depuração
            this.mangaService.findById(item.idManga.toString()).subscribe(manga => {
              console.log('Manga details:', manga); // Log para depuração
              this.mangas[item.idManga] = manga;
            });
          });
        } else {
          console.error('Order itens is not an array', order.itens); // Log para erro
        }
      });
    }

    getImageUrl(name: string) {
        const imageUrl =  this.mangaService.getUrlImagem(name)
        return imageUrl
    }

    voltarPagina() {
      this.location.back();
    }

    goToOrders(){
      this.voltarPagina();
    }

    formatarCEP(cep: string): string {
      if (!cep) return '';
      return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    censurarCartao(cartao: string): string {
      if (!cartao) return '';
      return cartao.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4');
    }
}
