import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthorService } from '../../../services/author.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Author } from '../../../models/author.model';
import { EmptyError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css'
})
export class AuthorFormComponent {

  formGroup: FormGroup;

  constructor(
              private formBuilder: FormBuilder,
              private authorService: AuthorService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar
            ) {

    const author: Author = activatedRoute.snapshot.data['author'];

    this.formGroup = formBuilder.group({
      id: [(author && author.id) ? author.id : null],
      name: [(author && author.name) ? author.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])]
    });

  }

  salvar() {
    if (this.formGroup.valid) {
      const author = this.formGroup.value;
      if (author.id ==null) {
        this.authorService.insert(author).subscribe({
          next: (authorCadastrado) => {
            this.router.navigateByUrl('/admin/authors');
            this.showSnackbarTopPosition('Autor adicionado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.authorService.update(author).subscribe({
          next: (authorAlterado) => {
            this.router.navigateByUrl('/admin/authors');
            this.showSnackbarTopPosition('Autor alterado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
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
      const author = this.formGroup.value;
      if (author.id != null) {
        if (confirm('Tem certeza que deseja excluir este autor?')) {
          this.authorService.delete(author.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/authors');
            this.showSnackbarTopPosition('Autor deletado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
            this.showSnackbarTopPosition('Erro ao excluir!', 'Fechar');
          }
        });
        }      
      }
    }
  }

  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    name: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve possuir ao menos 4 caracteres.'
    },
  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

}
