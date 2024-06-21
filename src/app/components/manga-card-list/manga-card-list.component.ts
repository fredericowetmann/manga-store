import { Component, OnInit, signal } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardTitle } from '@angular/material/card';
import { Manga } from '../../models/manga.model';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MangaService } from '../../services/manga.service';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../services/auth.service';

// tipo personalizado de dados, como classes e interfaces, porém mais simples.
type Card = {
  idManga: number;
  title: string;
  price: number;
  imageName: string;
  urlImagem: string;
  inventory: number;
}

@Component({
  selector: 'app-manga-card-list',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, NgFor, MatButtonModule, CurrencyPipe, MatIconModule, MatPaginatorModule, CommonModule],
  templateUrl: './manga-card-list.component.html',
  styleUrl: './manga-card-list.component.css'
})
export class MangaCardListComponent implements OnInit {

  cards = signal<Card[]> ([]);
  mangas: Manga[] = [];
  genericImage = 'assets/images/default-image.jpg';
  user: any;

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 100;
  page = 0;

  constructor(
              private mangaService: MangaService, 
              private cartService: CartService,
              private snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService
            ) {}

  ngOnInit(): void {
    this.carregarMangas();
    this.carregarUsuario();
  }

  carregarMangas(): void{
    // buscando todos as mangas
    this.mangaService.findAll(this.page, this.pageSize).subscribe(data => {
      this.mangas = data;
      console.log(this.mangas)
      this.carregarCards();
    });

    this.mangaService.count().subscribe(data => {
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
        urlImagem: this.mangaService.getUrlImagem(manga.imageName),
        inventory: manga.inventory
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

  lerMais(id: number){
    if (this.user === null) {
      this.router.navigateByUrl(`/manga/${id}`)
    } else if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/manga/${id}`)
    } else {
      this.router.navigateByUrl(`/manga/${id}`)
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

  // Método para paginar os resultados
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarMangas();
  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

}