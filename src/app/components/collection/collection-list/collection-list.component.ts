import { Component, OnInit } from '@angular/core';
import { Collection } from '../../../models/collection.model';
import { CollectionService } from '../../../services/collection.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css'
})
export class CollectionListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'name', 'description', 'action'];
  collections: Collection[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(private collectionService: CollectionService) {

  }

  ngOnInit(): void {
    this.collectionService.findAll(this.page, this.pageSize).subscribe(data => {
      this.collections = data;
      console.log(this.collections);
    });

    this.collectionService.count().subscribe(data => {
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

  getImageUrl(name: string) {
    const imageUrl =  this.collectionService.getUrlImagem(name)
    return imageUrl
   }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta coleção?')) {
      this.collectionService.delete(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  } 

}
