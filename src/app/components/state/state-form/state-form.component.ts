import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StateService } from '../../../services/state.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { State } from '../../../models/state.model';
import { EmptyError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-state-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './state-form.component.html',
  styleUrl: './state-form.component.css'
})
export class StateFormComponent {

  formGroup: FormGroup;

  constructor(
              private formBuilder: FormBuilder,
              private stateService: StateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar
            ) {

    const state: State = activatedRoute.snapshot.data['state'];

    this.formGroup = formBuilder.group({
      id: [(state && state.id) ? state.id : null],
      name: [(state && state.name) ? state.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      acronym: [(state && state.acronym) ? state.acronym : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(2),
                                Validators.maxLength(2)])]
    });

  }

  salvar() {
    if (this.formGroup.valid) {
      const state = this.formGroup.value;
      if (state.id ==null) {
        this.stateService.insert(state).subscribe({
          next: (stateCadastrado) => {
            this.router.navigateByUrl('/admin/states');
            this.showSnackbarTopPosition('Estado adicionado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.stateService.update(state).subscribe({
          next: (stateAlterado) => {
            this.router.navigateByUrl('/admin/states');
            this.showSnackbarTopPosition('Estado alterado com sucesso!', 'Fechar');
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
      const state = this.formGroup.value;
      if (state.id != null) {
        if (confirm('Tem certeza que deseja excluir este estado?')) {
          this.stateService.delete(state.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/states');
            this.showSnackbarTopPosition('Estado deletado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
            this.showSnackbarTopPosition('Erro ao deletar o Estado!', 'Fechar');
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
    acronym: {
      required: 'A sigla deve ser informada.',
      minlength: 'A sigla deve possuir 2 caracteres.',
      maxlength: 'A sigla deve possuir 2 caracteres.',
      apiError: ' ' // mensagem da api
    }
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
