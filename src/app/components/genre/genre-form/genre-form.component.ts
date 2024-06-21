import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GenreService } from '../../../services/genre.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Genre } from '../../../models/genre.model';
import { EmptyError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genre-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './genre-form.component.html',
  styleUrl: './genre-form.component.css'
})
export class GenreFormComponent {

  formGroup: FormGroup;

  constructor(
              private formBuilder: FormBuilder,
              private genreService: GenreService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar
            ) {

    const genre: Genre = activatedRoute.snapshot.data['genre'];

    this.formGroup = formBuilder.group({
      id: [(genre && genre.id) ? genre.id : null],
      name: [(genre && genre.name) ? genre.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      description: [(genre && genre.description) ? genre.description : ''],                              
    });

  }

  salvar() {
    if (this.formGroup.valid) {
      const genre = this.formGroup.value;
      if (genre.id ==null) {
        this.genreService.insert(genre).subscribe({
          next: (genreCadastrado) => {
            this.router.navigateByUrl('/admin/genres');
            this.showSnackbarTopPosition('Genero adicionado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.genreService.update(genre).subscribe({
          next: (genreAlterado) => {
            this.router.navigateByUrl('/admin/genres');
            this.showSnackbarTopPosition('Genero alterado com sucesso!', 'Fechar');
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
      const genre = this.formGroup.value;
      if (genre.id != null) {
        if (confirm('Tem certeza que deseja excluir este genero?')) {
          this.genreService.delete(genre.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/genres');
            this.showSnackbarTopPosition('Genero deletado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
            this.showSnackbarTopPosition('Erro ao deletar o Genero!', 'Fechar');
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
    description: {
      apiError: ' ' // mensagem da api
    },
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    // retorna a mensagem de erro
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && 
          this.errorMessages[controlName][errorName]) {
            return this.errorMessages[controlName][errorName];
      }
    }
    return 'Erro não mapeado (entre em contato com o desenvolvedor)';
  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

}
