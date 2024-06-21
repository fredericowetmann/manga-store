import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotFoundError } from 'rxjs';

@Component({
  selector: 'app-user-update-password',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatToolbar, MatIcon, MatBadge, MatButton, MatIconButton, RouterModule, CommonModule],
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.css']
})
export class UserUpdatePasswordComponent implements OnInit {
  formGroup: FormGroup;
  user: any
  senhaAntiga: boolean = false;
  senhaVisivel: boolean = false;
  confirmPassword: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
){
  this.formGroup = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', [Validators.required]]
  });
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    });
    }

  ngOnInit(): void {
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

  salvar(): void {
    if (this.formGroup.valid) {
      const userId = this.user.id;
      if(this.formGroup.value.newPassword != this.formGroup.value.confirmPassword){
        this.showSnackbarTopPosition("Dados invalidos", 'Fechar', 2000);
        throw new NotFoundError("Dados Invalidos");
      }
      const profile = {
        id: this.user.profile.id,
        label: this.user.profile.label
      }
      const address = {
        name: this.user.address.name,
        postalCode: this.user.address,
        address: this.user.address.address,
        complement: this.user.address.complement,
        city: this.user.address.city.id
      }
      const usuarioAtualizado = {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        cpf: this.user.cpf,
        password: this.formGroup.value.newPassword,
        profile: profile,
        imageName: this.user.imageName,
        address: address
      }
      this.userService.updatePassword(userId, this.formGroup.value).subscribe(response => {
        this.authService.setUsuarioLogado(usuarioAtualizado)
        window.location.reload();
      }, error => {
        this.showSnackbarTopPosition("Dados invalidos", 'Fechar', 2000);
      });
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

  showSnackbarTopPosition(content: any, action: any, duration: any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  toggleSenhaVisivel() {
    this.senhaVisivel = !this.senhaVisivel;
  }

  toggleSenhaVisivel2() {
    this.confirmPassword = !this.confirmPassword;
  }

  toggleSenhaVisivel3() {
    this.senhaAntiga = !this.senhaAntiga;
  }
}
