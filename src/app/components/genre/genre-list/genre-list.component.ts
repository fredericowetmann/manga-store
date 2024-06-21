import { Component, OnInit } from '@angular/core';
import { Genre } from '../../../models/genre.model';
import { GenreService } from '../../../services/genre.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];
  genres: Genre[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(private genreService: GenreService) {

  }

  ngOnInit(): void {
    this.genreService.findAll(this.page, this.pageSize).subscribe(data => {
      this.genres = data;
      console.log(this.genres);
    });

    this.genreService.count().subscribe(data => {
      this.totalRecords = data;
      console.log(this.totalRecords);
    });
  }
  // Método para paginar os resultados
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esse genero?')) {
      this.genreService.delete(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  } 

}
