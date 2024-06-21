import { Component, OnInit,Inject} from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})

export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'cpf', 'profile', 'action'];
  users: User[] = [];

  // variaveis de controle de paginacao
  totalRecords = 0;
  pageSize = 8;
  page = 0;


  constructor(private userService: UserService,public dialog: MatDialog) {  }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.userService.findAll(this.page, this.pageSize).subscribe(data => {
      this.users = data;
    });

    this.userService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }

  // Método para paginar os resultados
  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();   
  }

  delete(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuario?')) {
      this.userService.delete(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }  


  // openDialog(phones: Phone[],enterAnimationDuration: string, exitAnimationDuration: string): void {
  //   this.dialog.open(DialogComponent, {
  //     width: '300px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //     data: { phones: phones }
  //   });
  // }

}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './phone.component.html',
  styleUrl: './user-list.component.css',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,NgFor,MatCardModule],
})
export class DialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public phones: any) {
    console.log(phones)
  }
}
