import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { User } from '../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Profile } from '../../../models/profile.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { City } from '../../../models/city.model';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit{

  formGroup: FormGroup;
  profile: Profile[] = [];
  city: City[] = [];

  constructor(
              private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private cityService: CityService
            ) {

    const user: User = activatedRoute.snapshot.data['user']; 

    this.formGroup = formBuilder.group({
      id: [(user && user.id) ? user.id : null],
      name: [(user && user.name) ? user.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      email: [(user && user.email) ? user.email : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(3),
                                Validators.email])],
      password: [(user && user.password) ? user.email : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(2)])],
      cpf: [(user && user.cpf) ? user.cpf : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(11),
                                Validators.maxLength(14)])],
      profile: [(user && user.profile)? user.profile.id : null,],
      
      addressName: ['', Validators.required],
      addressPostalCode: ['', Validators.required],
      addressAddress: ['', Validators.required],
      addressComplement: ['', Validators.required],
      addressCity: [null, Validators.required],
    });

  }
  ngOnInit(): void {
    this.userService.findProfiles().subscribe(data => {
      this.profile = data;
      this.initializeForm();
    });
    this.cityService.findAll().subscribe(data => {
      this.city = data;
      this.initializeForm();
    });
  }

  initializeForm() {
    const user: User = this.activatedRoute.snapshot.data['user'];
    // selecionando as associações

    const city = this.city
      .find(city => city.id === (user?.address.city?.id || null)); 

    const profile = this.profile
      .find(profile => profile.id === (user?.profile?.id || null));

      this.formGroup = this.formBuilder.group({
      id: [(user && user.id) ? user.id : null],
      name: [(user && user.name) ? user.name : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      email: [(user && user.email) ? user.email : '', 
            Validators.compose([Validators.required,
                                Validators.email])],
      password: [(user && user.password) ? user.email : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(2)])],
      cpf: [(user && user.cpf) ? user.cpf : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(11),
                                Validators.maxLength(14)])],
      profile: [profile,
            Validators.compose([Validators.required,])],

      addressName: [(user && user.address.name)? user.address.name : '',
            Validators.compose([Validators.required,])],
      addressPostalCode: [(user && user.address.postalCode)? user.address.postalCode : '',
            Validators.compose([Validators.required,])],
      addressAddress: [(user && user.address.address)? user.address.address : '',
            Validators.compose([Validators.required,])],
      addressComplement: [(user && user.address.complement)? user.address.complement : '',
            Validators.compose([Validators.required,])],
      addressCity: [city,
            Validators.compose([Validators.required,])],

    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const user = this.formGroup.value;
      console.log(user)
      if (user.id == null) {
        const profile = {
          id: user.profile.id,
          label: user.profile.label
        }
        const address = {
          name: user.addressName,
          postalCode: user.addressPostalCode,
          address: user.addressAddress,
          complement: user.addressComplement,
          city: user.addressCity
        }
        const usuario = {
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          password: user.password,
          profile: profile,
          imageName: '',
          address: address
        }
        this.userService.insert(usuario).subscribe({
          next: (userCadastrado) => {
            this.router.navigateByUrl('/admin/users');
            this.showSnackbarTopPosition('Usuario adicionado com sucesso!', 'Fechar');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        const profile = {
          id: user.profile.id,
          label: user.profile.label
        }
        const address = {
          name: user.addressName,
          postalCode: user.addressPostalCode,
          address: user.addressAddress,
          complement: user.addressComplement,
          city: user.addressCity
        }
        const usuario = {
          id: user.id,
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          password: user.password,
          profile: profile,
          imageName: '',
          address: address
        }
        this.userService.update(usuario).subscribe({
          next: (userAlterado) => {
            this.router.navigateByUrl('/admin/users');
            this.showSnackbarTopPosition('Usuario alterado com sucesso!', 'Fechar');
          },
          error: (err) => {
            this.showSnackbarTopPosition('Erro ao editar', 'Fechar');
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
    if (this.formGroup.enabled) {
      const user = this.formGroup.value;
      if (user.id != null) {
        if (confirm('Tem certeza que deseja excluir este usuario?')) {
          this.userService.delete(user.id).subscribe({
            next: () => {
              this.router.navigateByUrl('/admin/users');
              this.showSnackbarTopPosition('Usuario deletado com sucesso!', 'Fechar');
            },
            error: (err) => {
              console.log('Erro ao Excluir' + JSON.stringify(err));
              this.showSnackbarTopPosition('Erro ao deletar o Usuario!', 'Fechar');
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