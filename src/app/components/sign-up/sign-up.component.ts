import { NgIf, CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { BasicUserService } from "../../services/userbasic.service";
import { UserBasic } from "../../models/userbasic.model";
import { NotFoundError } from "rxjs";

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule, CommonModule, MatIconModule],
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
})

export class SignupComponent implements OnInit{
    senhaVisivel: boolean = false;
    confirmPassword: boolean = false;
    loginForm!: FormGroup;

    constructor(
                private formBuilder: FormBuilder,
                private router: Router,
                private signup: BasicUserService,
                private snackBar: MatSnackBar
              ){}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
          name: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(3)]],
          confirmPassword: ['', [Validators.required]]
        });
    }

    onRegister() {
        if (this.loginForm.valid) {
          if(this.loginForm.value.password != this.loginForm.value.confirmPassword){
            this.showSnackbarTopPosition("Dados invalidos", 'Fechar', 2000);
            throw new NotFoundError("Dados Invalidos");
          }
          const loginData: UserBasic = {
            name: this.loginForm.get('name')!.value,
            email: this.loginForm.get('email')!.value,
            password: this.loginForm.get('password')!.value
          };
    
          this.signup.insert(loginData).subscribe({
            next: (resp) => {
              // redirecionar para a página de login
              this.router.navigateByUrl('/login');
              this.showSnackbarTopPosition('Cadastro realizado com sucesso!', 'Fechar', 2000);
            },
            error: (err) => {
              console.log(err);
              this.showSnackbarTopPosition("Usuário ou senha Inválidos", 'Fechar', 2000);
            }
          });
        } else {
          this.showSnackbarTopPosition("Dados inválidos", 'Fechar', 2000);
        }
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
}
    