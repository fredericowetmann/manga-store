import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city.model';
import { CityService } from '../../services/city.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-update-info',
  standalone:true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatToolbar, MatIcon, MatBadge, MatButton, MatIconButton, RouterModule, CommonModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './user-update-info.component.html',
  styleUrls: ['./user-update-info.component.css']
})
export class UserUpdateInfoComponent implements OnInit {
    formGroup: FormGroup;
    user: any
    city: City[] = [];
    cities: any;

    fileName: string = '';
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;
    apiResponse: any = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private cityService: CityService,
    private router: Router
){
  const user: User = this.user

  this.formGroup = fb.group({
    name: [(user && user.name) ? user.name : '', 
          Validators.compose([Validators.required, 
                              Validators.minLength(3)])],
    email: [(user && user.email) ? user.email : '', 
          Validators.compose([Validators.required, 
                              Validators.email])],
    cpf: [(user && user.cpf) ? user.cpf : '', 
          Validators.compose([Validators.required, 
                              Validators.minLength(11),
                              Validators.maxLength(11)])],
    addressName: ['', Validators.required],
    addressPostalCode: ['', Validators.required],
    addressAddress: ['', Validators.required],
    addressComplement: ['', Validators.required],
    addressCity: [null],
  });
  }

  initializeForm() {
    const user: User = this.user

    const city = this.city
      .find(city => city.id === (user?.address.city?.id || null)); 

  this.formGroup = this.fb.group({
    name: [(user && user.name) ? user.name : '', 
          Validators.compose([Validators.required, 
                              Validators.minLength(3)])],
    email: [(user && user.email) ? user.email : '', 
          Validators.compose([Validators.required, 
                              Validators.email])],
    cpf: [(user && user.cpf) ? user.cpf : '', 
          Validators.compose([Validators.required, 
                              Validators.minLength(11),
                              Validators.maxLength(11)])],
                              addressName: [(user && user.address.name)? user.address.name : '', 
                                Validators.compose([Validators.required
            ])],
        addressPostalCode: [(user && user.address.postalCode)? user.address.postalCode : '', 
                                Validators.compose([Validators.required,
                                Validators.minLength(8),
                                Validators.maxLength(8),
                                Validators.pattern('^[0-9]*$')
            ])],
        addressAddress: [(user && user.address.address)? user.address.address : '', 
                                Validators.compose([Validators.required
            ])],
        addressComplement: [(user && user.address.complement)? user.address.complement : '', 
                                Validators.compose([Validators.required
            ])],
        addressCity: [city, Validators.compose([Validators.required])]
  });
    }

  ngOnInit(): void {
    this.cityService.findAll().subscribe(data => {
      this.city = data;
      this.initializeForm();
    });
    this.carregarUsuario();
    this.initializeForm();
  }

  carregarUsuario() {
    this.authService.getUsuarioLogado().subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    );
  }

  navegation(string: string): void {
    if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/profile/${string}`)
    } else {
      this.router.navigateByUrl(`profile/${string}`)
    }
  }

  getCityId(id: number){
    this.cityService.findById(id.toString()).subscribe(data => {
      this.cities = data;
    });
  }

  salvar(): void {
    if (this.formGroup.valid) {
      const userId = this.user.id;
      this.getCityId(this.formGroup.value.addressCity.id);
      const profile = {
        id: this.user.profile.id,
        label: this.user.profile.label
      }
      const state = {
        id: this.cities.state.id,
        acronym: this.cities.state.acronym,
        name: this.cities.state.name
      }
      const city = {
        id: this.cities.id,
        name: this.cities.name,
        state: state
      }
      const address = {
        name: this.formGroup.value.addressName,
        postalCode: this.formGroup.value.addressPostalCode,
        address: this.formGroup.value.addressAddress,
        complement: this.formGroup.value.addressComplement,
        city: city
      }
      const usuarioAtualizado = {
        id: this.user.id,
        name: this.formGroup.value.name,
        email: this.formGroup.value.email,
        cpf: this.formGroup.value.cpf,
        password: this.user.password,
        profile: profile,
        imageName: this.fileName,
        address: address
      }
      this.userService.updateUser(userId, this.formGroup.value).subscribe(response => {
        this.uploadImage(userId)
        this.authService.setUsuarioLogado(usuarioAtualizado)
        window.location.reload();
        window.scrollTo(0, 0);
      }, error => {
        // Handle error
      });
    }
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
      this.userService.salvarImagem(id, this.selectedFile.name, this.selectedFile).subscribe({
        next: () => {
          console.log('Imagem atualizada com sucesso');
        },
        error: err => {
          console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        }
      })
    }
  }
}
