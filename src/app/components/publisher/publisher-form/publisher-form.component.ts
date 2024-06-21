import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PublisherService } from '../../../services/publisher.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Publisher } from '../../../models/publisher.model';
import { EmptyError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publisher-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './publisher-form.component.html',
  styleUrl: './publisher-form.component.css'
})
export class PublisherFormComponent {

  formGroup: FormGroup;

  constructor(
              private formBuilder: FormBuilder,
              private publisherService: PublisherService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar
            ){

    const publisher: Publisher = activatedRoute.snapshot.data['publisher'];

    this.formGroup = formBuilder.group({
      id: [(publisher && publisher.id) ? publisher.id : null],
      name: [(publisher && publisher.name) ? publisher.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])]
    });

  }

  salvar() {
    if (this.formGroup.valid) {
      const publisher = this.formGroup.value;
      if (publisher.id ==null) {
        this.publisherService.insert(publisher).subscribe({
          next: (publisherCadastrado) => {
            this.router.navigateByUrl('/admin/publishers');
            this.showSnackbarTopPosition('Publicadora adicionada com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.publisherService.update(publisher).subscribe({
          next: (publisherAlterado) => {
            this.router.navigateByUrl('/admin/publishers');
            this.showSnackbarTopPosition('Publicadora alterada com sucesso!', 'Fechar');
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
      const publisher = this.formGroup.value;
      if (publisher.id != null) {
        if (confirm('Tem certeza que deseja excluir esta publicadora?')) {
          this.publisherService.delete(publisher.id).subscribe({
          next: () => {
            this.router.navigateByUrl('admin/publishers');
            this.showSnackbarTopPosition('Publicadora deletada com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
            this.showSnackbarTopPosition('Erro ao excluir a publicadora!', 'Fechar');
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
