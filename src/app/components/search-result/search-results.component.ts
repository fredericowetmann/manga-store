import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { Manga } from '../../models/manga.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardTitle } from '@angular/material/card';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

type Card = {
  idManga: number;
  title: string;
  price: number;
  imageName: string;
  urlImagem: string;
};

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, NgFor, MatButtonModule, CurrencyPipe, MatIconModule, MatPaginatorModule, CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  name: string = '';
  cards = signal<Card[]> ([]);
  mangas: Manga[] = [];
  genericImage = 'assets/images/default-image.jpg';

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 30;
  page = 0;

  constructor(
              private route: ActivatedRoute,
              private mangaService: MangaService, 
              private cartService: CartService,
              private snackBar: MatSnackBar,
              private router: Router
            ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.name = params['q'];
      this.carregarMangas();
    });
  }

  carregarMangas(): void {
    // Limpa os resultados anteriores antes de realizar a nova busca
    this.mangas = [];
    this.cards.set([]);
    this.totalRecords = 0;

    this.mangaService.findByName(this.name, this.page, this.pageSize).subscribe(data => {
      this.mangas = data;
      console.log(this.mangas);
      this.carregarCards();
    });
    
    this.mangaService.countByName(this.name).subscribe(data => {
      this.totalRecords = data;
    });
  }

  carregarCards() {
    const cards: Card[] = [];
    this.mangas.forEach(manga => {
      cards.push({
        idManga: manga.id,
        title: manga.name,
        price: manga.price,
        imageName: manga.imageName,
        urlImagem: this.mangaService.getUrlImagem(manga.imageName)
      });
    });
    this.cards.set(cards);
  }
  
  adicionarAoCart(card: Card) {
    this.showSnackbarTopPosition('Produto adicionado ao carrinho!', 'Fechar');
    this.cartService.adicionar({
      id: card.idManga,
      name: card.title,
      price: card.price,
      quantity: 1,
      urlImagem: card.urlImagem
    });
  }

  lerMais(id: number) {
    this.router.navigateByUrl(`/mangas/${id}`);
    window.scrollTo(0, 0);
  }

  // Método para paginar os resultados
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarMangas();
  }

  showSnackbarTopPosition(content: any, action: any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: 'top', // Allowed values are 'top' | 'bottom'
      horizontalPosition: 'center' // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
