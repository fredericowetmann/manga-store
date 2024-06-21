import { Component, OnInit } from '@angular/core';
import { Publisher } from '../../../models/publisher.model';
import { PublisherService } from '../../../services/publisher.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule],
  templateUrl: './publisher-list.component.html',
  styleUrl: './publisher-list.component.css'
})
export class PublisherListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  publishers: Publisher[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(private publisherService: PublisherService) {

  }

  ngOnInit(): void {
    this.publisherService.findAll(this.page, this.pageSize).subscribe(data => {
      this.publishers = data;
      console.log(this.publishers);
    });

    this.publisherService.count().subscribe(data => {
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
    if (confirm('Tem certeza que deseja excluir esta publicadora?')) {
      this.publisherService.delete(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  } 



}
