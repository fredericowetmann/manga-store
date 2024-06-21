import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CollectionService } from '../../../services/collection.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Collection } from '../../../models/collection.model';
import { EmptyError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatIcon],
  templateUrl: './collection-form.component.html',
  styleUrl: './collection-form.component.css'
})
export class CollectionFormComponent {

  formGroup: FormGroup;

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  apiResponse: any = null;

  constructor(
              private formBuilder: FormBuilder,
              private collectionService: CollectionService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar
            ) {

    const collection: Collection = activatedRoute.snapshot.data['collection'];

    this.formGroup = formBuilder.group({
      id: [(collection && collection.id) ? collection.id : null],
      name: [(collection && collection.name) ? collection.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(1)])],
      description: [(collection && collection.description) ? collection.description : ''],                              
    });

  }

  salvar() {
    if (this.formGroup.valid) {
      const collection = this.formGroup.value;
      if (collection.id ==null) {
        this.collectionService.insert(collection).subscribe({
          next: (collectionCadastrado) => {
            this.uploadImage(collectionCadastrado.id)
            this.showSnackbarTopPosition('Coleção adicionada com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.collectionService.update(collection).subscribe({
          next: (collectionAlterado) => {
            this.uploadImage(collection.id)
            this.showSnackbarTopPosition('Coleção alterada com sucesso!', 'Fechar');
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
      const collection = this.formGroup.value;
      if (collection.id != null) {
        if (confirm('Tem certeza que deseja excluir esta coleção?')) {
          this.collectionService.delete(collection.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/collections');
            this.showSnackbarTopPosition('Coleção deletada com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
            this.showSnackbarTopPosition('Erro ao excluir a Coleção!', 'Fechar');
          }
        });
        }    
      }
    }
  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }

  }

  private uploadImage(id: number) {
    if (this.selectedFile) {
      this.collectionService.salvarImagem(id, this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/collections');
        },
        error: err => {
          console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        }
      })
    }
  }
}
