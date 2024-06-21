import { Component, OnInit } from '@angular/core';
import { Author } from '../../../models/author.model';
import { AuthorService } from '../../../services/author.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})
export class AuthorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  authors: Author[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(
              private authorService: AuthorService,
              private snackBar: MatSnackBar
            ) {

  }

  ngOnInit(): void {
    this.authorService.findAll(this.page, this.pageSize).subscribe(data => {
      this.authors = data;
      console.log(this.authors);
    });

    this.authorService.count().subscribe(data => {
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
    if (confirm('Tem certeza que deseja excluir este autor?')) {
      this.authorService.delete(id).subscribe(() => {
        this.ngOnInit();
      });
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
