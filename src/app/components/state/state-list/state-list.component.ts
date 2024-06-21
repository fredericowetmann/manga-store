import { Component, OnInit } from '@angular/core';
import { State } from '../../../models/state.model';
import { StateService } from '../../../services/state.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-state-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css'
})
export class StateListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'acronym', 'action'];
  states: State[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(private stateService: StateService) {

  }

  ngOnInit(): void {
    this.stateService.findAll(this.page, this.pageSize).subscribe(data => {
      this.states = data;
      console.log(this.states);
    });

    this.stateService.count().subscribe(data => {
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
    if (confirm('Tem certeza que deseja excluir este estado?')) {
      this.stateService.delete(id).subscribe(() => {
        this.ngOnInit();
      });
    }
  }  

}