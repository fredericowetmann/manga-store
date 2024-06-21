import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

// tipo personalizado de dados, como classes e interfaces, porém mais simples.
type Manga = {
    id: number;
    name: string;
    price: number;
    imageName: string;
    quantity: number;
    urlImagem: string;
  }

@Component({
  selector: 'app-manga-detail',
  standalone: true,
  imports: [CurrencyPipe, NgIf, MatIcon, NgFor, MatButtonModule, MatButton],
  templateUrl: './manga-detail.component.html',
  styleUrls: ['./manga-detail.component.css'],
})
export class MangaDetailComponent implements OnInit {

  manga: any
  mangaId: string | null = null;
  genericImage = 'assets/images/default-image.jpg';
  user: any;

  constructor(
    private mangaService: MangaService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = +params['id']; // '+' converts string to number
      this.getMangaDetails(id);
    });
    this.carregarUsuario();
  }

  getMangaDetails(id: number){
    if (id) {
      this.mangaService.findById(id.toString())
        .subscribe(manga => this.manga = manga);
    }
    window.scrollTo(0, 0);
  }

  adicionarAoCart(manga: Manga) {
    this.showSnackbarTopPosition('Produto adicionado ao carrinho!', 'Fechar');
    this.cartService.adicionar({
      id: manga.id,
      name: manga.name,
      price: manga.price,
      quantity: 1,
      urlImagem: this.mangaService.getUrlImagem(manga.imageName)
    })
  }

  getImageUrl(imageName: string) {
    const imageUrl =  this.mangaService.getUrlImagem(imageName)
    return imageUrl
   }

   searchGenre(id: number){
    if (this.user === null) {
      this.router.navigateByUrl(`/search/genero/${id}`)
      window.scrollTo(0, 0);
    } else if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/search/genero/${id}`)
      window.scrollTo(0, 0);
    } else {
      this.router.navigateByUrl(`/search/genero/${id}`)
      window.scrollTo(0, 0);
    }
  }
  
  searchCollection(id: number){
    if (this.user === null) {
      this.router.navigateByUrl(`/search/colecao/${id}`)
      window.scrollTo(0, 0);
    } else if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/search/colecao/${id}`)
      window.scrollTo(0, 0);
    } else {
      this.router.navigateByUrl(`/search/colecao/${id}`)
      window.scrollTo(0, 0);
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

   showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

}
