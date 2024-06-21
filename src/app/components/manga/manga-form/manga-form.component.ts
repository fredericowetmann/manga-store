import { NgIf, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Manga } from '../../../models/manga.model';
import { CollectionService } from '../../../services/collection.service';
import { PublisherService } from '../../../services/publisher.service';
import { AuthorService } from '../../../services/author.service';
import { GenreService } from '../../../services/genre.service';
import { MangaService } from '../../../services/manga.service';
import { Collection } from '../../../models/collection.model';
import { Publisher } from '../../../models/publisher.model';
import { Author } from '../../../models/author.model';
import { Genre } from '../../../models/genre.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manga-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, 
    RouterModule, MatSelectModule, CommonModule, MatCheckboxModule, MatIcon],
  templateUrl: './manga-form.component.html',
  styleUrl: './manga-form.component.css'
})
export class MangaFormComponent implements OnInit {

  formGroup: FormGroup;
  collection: Collection[] = [];
  publisher: Publisher[] = [];
  author: Author[] = [];
  listGenre: Genre[] = [];

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  apiResponse: any = null;

  constructor(
              private formBuilder: FormBuilder,
              private mangaService: MangaService,
              private collectionService: CollectionService,
              private publisherService: PublisherService,
              private authorService: AuthorService,
              private genreService: GenreService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private snackBar: MatSnackBar
            ) {

    const manga: Manga = this.activatedRoute.snapshot.data['manga'];

    this.formGroup = formBuilder.group({
      id: [(manga && manga.id) ? manga.id : null],
      name: ['', Validators.required],
      description: [null],
      price: ['', Validators.required],
      inventory: ['', Validators.required],
      numPages: ['', Validators.required],
      volume: ['', Validators.required],
      collection:[(manga && manga.collection)? manga.collection.id : null],
      publisher:[(manga && manga.publisher)? manga.publisher.id : null],
      author:[(manga && manga.author)? manga.author.id : null],
      listGenre:[(manga && manga.listGenre)? manga.listGenre.map((genre) => genre.id) : null]
    });
  }
  ngOnInit(): void {
    this.collectionService.findAll().subscribe(data => {
      this.collection = data;
      this.initializeForm();
    });
    this.publisherService.findAll().subscribe(data => {
      this.publisher = data;
      this.initializeForm();
    });
    this.authorService.findAll().subscribe(data => {
      this.author = data;
      this.initializeForm();
    });
    this.genreService.findAll().subscribe(data => {
      this.listGenre = data;
      this.initializeForm();
    });
  }

  initializeForm() {

    const manga: Manga = this.activatedRoute.snapshot.data['manga'];

    // selecionando as associações
    const collection = this.collection
      .find(collection => collection.id === (manga?.collection?.id || null)); 
    const publisher = this.publisher
      .find(publisher => publisher.id === (manga?.publisher?.id || null)); 
    const author = this.author
      .find(author => author.id === (manga?.author?.id || null));

    this.formGroup = this.formBuilder.group({
      id: [(manga && manga.id) ? manga.id : null],
      name: [(manga && manga.name) ? manga.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      description: [(manga && manga.description) ? manga.description : ''],
      price: [(manga && manga.price) ? manga.price : '', 
            Validators.compose([Validators.required,
            Validators.min(0),
            Validators.pattern(/^\d*.?\d+$/),])],
      inventory: [(manga && manga.inventory) ? manga.inventory : '', 
            Validators.compose([Validators.required,
                                Validators.min(0),Validators.pattern('^[0-9]*$')])],
      numPages: [(manga && manga.numPages) ? manga.numPages : '', 
            Validators.compose([Validators.required,
            Validators.min(0),Validators.pattern('^[0-9]*$')])], 
      volume: [(manga && manga.volume) ? manga.volume : '', 
            Validators.compose([Validators.required,
            Validators.min(0),Validators.pattern('^[0-9]*$')])],
      collection: [collection,Validators.compose([Validators.required,])],
      publisher: [publisher,Validators.compose([Validators.required,])],
      author: [author,Validators.compose([Validators.required,])],
      listGenre:[(manga && manga.listGenre)? manga.listGenre.map((genre) => genre.id) : null,Validators.compose([Validators.required,])],
    });

  }

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const manga = this.formGroup.value;
      if (manga.id == null) {
        this.mangaService.insert(manga).subscribe({
          next: (mangaCadastrado) => {
            this.uploadImage(mangaCadastrado.id);
            this.showSnackbarTopPosition('Manga adicionado com sucesso!', 'Fechar');
          },
          error: (errorResponse) => {      
            console.log('Erro ao incluir' + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.mangaService.update(manga).subscribe({
          next: (mangaAtualizado) => {
            console.log(manga)
            this.uploadImage(manga.id);
            this.showSnackbarTopPosition('Manga adicionado com sucesso!', 'Fechar');
          },
          error: (errorResponse) => {      
            console.log('Erro ao incluir' + JSON.stringify(errorResponse));
          }
        });        
      }
    }
  }

  tratarErros(error: HttpErrorResponse) {
    if (error.status === 400) {
      // erros relacionados a campos
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
          // obs: o fieldName tem o mesmo valor da api
          const formControl = this.formGroup.get(validationError.fieldName);
          console.log(validationError);
          if (formControl) {
            console.log(formControl);
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      };
    } else if (error.status < 400) {
        // Erro genérico não relacionado a um campo específico.
        alert(error.error?.message || 'Erro genérico no envio do formulário.');
    } else if (error.status >= 500) {
        alert('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const manga = this.formGroup.value;
      if (manga.id != null) {
        if (confirm('Tem certeza que deseja excluir este manga?')) {
          this.mangaService.delete(manga.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/mangas');
            this.showSnackbarTopPosition('Manga deletado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
            this.showSnackbarTopPosition('Erro ao deletar o Manga!', 'Fechar');
          }
        });
        }
      }
    }
  }

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }

  }

  private uploadImage(idManga: number) {
    if (this.selectedFile) {
      this.mangaService.salvarImagem(idManga, this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/mangas');
        },
        error: err => {
          console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        }
      })
    }
  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
