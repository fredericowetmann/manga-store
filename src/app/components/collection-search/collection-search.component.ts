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
import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../models/collection.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

type Card = {
  idManga: number;
  title: string;
  price: number;
  imageName: string;
  urlImagem: string;
};

@Component({
  selector: 'app-collection-search',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, NgFor, MatButton, CurrencyPipe, MatIcon, MatPaginatorModule],
  templateUrl: './collection-search.component.html',
  styleUrls: ['./collection-search.component.css']
})
export class CollectionSearchComponent implements OnInit {
  collectionId: number = 0;
  collection: Collection | null = null;
  cards = signal<Card[]> ([]);
  mangas: Manga[] = [];
  genericImage = 'assets/images/default-image.jpg';
  urlImage: string = '';

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
              private collectionService: CollectionService
            ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.collectionId = +params['id'];
      this.getCollection();
      this.carregarMangas();
    });
  }

  getCollection() {
    this.collectionService.findById(this.collectionId.toString()).subscribe((collection: Collection) => {
      this.collection = collection;
      this.collectionId = collection.id
      this.urlImage = collection.imageName
    });
  }

  carregarMangas(): void{
    // buscando mangas por nome
    this.mangaService.findByCollection(this.collectionId, this.page, this.pageSize).subscribe(data => {
      this.mangas = data;
      console.log(this.mangas)
      this.carregarCards();
    });
    
    this.mangaService.countByCollection(this.collectionId.toString()).subscribe(data => {
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

  getImageUrl(name: string) {
    const imageUrl =  this.collectionService.getUrlImagem(name)
    return imageUrl
   }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
