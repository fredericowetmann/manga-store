import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { Manga } from '../../models/manga.model';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardTitle } from '@angular/material/card';
import { CurrencyPipe, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../models/genre.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

type Card = {
  idManga: number;
  title: string;
  price: number;
  imageName: string;
  urlImagem: string;
};

@Component({
  selector: 'app-genre-search',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, NgFor, MatButton, CurrencyPipe, MatIcon, MatPaginatorModule],
  templateUrl: './genre-search.component.html',
  styleUrls: ['./genre-search.component.css']
})
export class GenreSearchComponent implements OnInit {
  genreId: number = 0;
  genre: Genre | null = null;
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
              private router: Router,
              private cartService: CartService,
              private snackBar: MatSnackBar,
              private genreService: GenreService
            ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.genreId = +params['id'];
      this.getGenre();
      this.carregarMangas();
    });
  }

  getGenre() {
    this.genreService.findById(this.genreId.toString()).subscribe((genre: Genre) => {
      this.genre = genre;
      this.genreId = genre.id
    });
  }

  carregarMangas(): void{
    // buscando mangas por nome
    this.mangaService.findByGenre(this.genreId, this.page, this.pageSize).subscribe(data => {
      this.mangas = data;
      console.log(this.mangas)
      this.carregarCards();
    });
    
    this.mangaService.countByGenre(this.genreId.toString()).subscribe(data => {
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
    })
  }

  lerMais(id: number){
    this.router.navigateByUrl(`/mangas/${id}`)
    window.scrollTo(0, 0);
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
