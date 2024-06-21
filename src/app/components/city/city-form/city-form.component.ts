import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { State } from '../../../models/state.model';
import { City } from '../../../models/city.model';
import { StateService } from '../../../services/state.service';
import { CityService } from '../../../services/city.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, 
    RouterModule, MatSelectModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.css'
})
export class CityFormComponent implements OnInit {

  formGroup: FormGroup;
  states: State[] = [];

  constructor(
              private formBuilder: FormBuilder,
              private cityService: CityService,
              private stateService: StateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar   
            ) {

    this.formGroup = formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      state: [null]
    });
  }
  ngOnInit(): void {
    this.stateService.findAll().subscribe(data => {
      this.states = data;
      this.initializeForm();
    });
  }

  initializeForm() {

    const city: City = this.activatedRoute.snapshot.data['city'];

    // selecionando o estado
    const state = this.states
      .find(state => state.id === (city?.state?.id || null)); 

    this.formGroup = this.formBuilder.group({
      id: [(city && city.id) ? city.id : null],
      name: [(city && city.name) ? city.name : '', Validators.required],
      state: [state]
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const city = this.formGroup.value;
      if (city.id ==null) {
        this.cityService.insert(city).subscribe({
          next: (cityCadastrado) => {
            this.router.navigateByUrl('admin/cities');
            this.showSnackbarTopPosition('Cidade adicionada com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.cityService.update(city).subscribe({
          next: (cityAlterado) => {
            this.router.navigateByUrl('/admin/cities');
            this.showSnackbarTopPosition('Cidade alterada com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
          }
        });
      }
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const city = this.formGroup.value;
      if (city.id != null) {
        if (confirm('Tem certeza que deseja excluir esta cidade?')) {
          this.cityService.delete(city).subscribe({
          next: () => {
            this.router.navigateByUrl('adimin/cities');
            this.showSnackbarTopPosition('Produto deletado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
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

}
