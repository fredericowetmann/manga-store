import { Component, OnInit, Inject} from '@angular/core';
import { Manga } from '../../../models/manga.model';
import { MangaService } from '../../../services/manga.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Genre } from '../../../models/genre.model';

@Component({
  selector: 'app-manga-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule, CommonModule],
  templateUrl: './manga-list.component.html',
  styleUrl: './manga-list.component.css'
})
export class MangaListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'name', 'description', 'price', 'inventory', 'numPages', 'volume', 'collection', 'publisher', 'author', 'genres', 'action'];
  mangas: Manga[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(private mangaService: MangaService,
              public dialog: MatDialog
            ) {}

  ngOnInit(): void {
    this.loadMangas()
  }

  loadMangas(): void {
    this.mangaService.findAll(this.page, this.pageSize).subscribe(data => {
      this.mangas = data;
      console.log(this.mangas);
    });

    this.mangaService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }
  
  // Método para paginar os resultados
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMangas();
  }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir este manga?')) {
      this.mangaService.delete(id).subscribe(() => {
        this.loadMangas();
      });
    }
  }

  getImageUrl(imageName: string) {
   const imageUrl =  this.mangaService.getUrlImagem(imageName)
   return imageUrl
  }

  openDialog(genres: Genre[],enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { genres: genres }
    });
  }

  openDialogDescription(name: string,enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DescriptionDialog, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: name
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './genre.component.html',
  styleUrl: './manga-list.component.css',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,NgFor],
})
export class DialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public genres: any) {
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './description.component.html',
  styleUrl: './manga-list.component.css',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,NgFor],
})
export class DescriptionDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public name: string) {
  }
}
