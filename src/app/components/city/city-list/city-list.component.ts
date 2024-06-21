import { Component, OnInit } from '@angular/core';
import { City } from '../../../models/city.model';
import { CityService } from '../../../services/city.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
  , MatButtonModule, RouterModule,MatPaginatorModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
})
export class CityListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'state', 'action'];
  cities: City[] = [];


  totalRecords = 0;
  pageSize = 8;
  page = 0;

  constructor(
              private cityService: CityService,
              private snackBar: MatSnackBar
            ) {

  }

  ngOnInit(): void {
    this.cityService.findAll(this.page, this.pageSize).subscribe(data => {
      this.cities = data;
      console.log(this.cities);
    });

    this.cityService.count().subscribe(data => {
      this.totalRecords = data;
      console.log(this.totalRecords);
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta publicadora?')) {
      this.cityService.delete(id).subscribe(() => {
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