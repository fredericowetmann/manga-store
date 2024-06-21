import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { MatBadge } from "@angular/material/badge";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { UserService } from "../../services/user.service";
import { City } from "../../models/city.model";
import { CityService } from "../../services/city.service";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MatToolbar, MatIcon, MatBadge, MatButton, MatIconButton, RouterModule, CommonModule],
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  city: City[] = [];
  user: any;
  genericImage = 'assets/images/default-profile.jpg';

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.carregarUsuario();
    this.cityService.findAll().subscribe(data => {
      this.city = data;
    });
  }

  navegation(string: string): void {
    if (this.user.profile.label === 'Admin'){
      this.router.navigateByUrl(`/admin/profile/${string}`)
    } else {
      this.router.navigateByUrl(`profile/${string}`)
    }
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
  
  getImageUrl(id: number) {
    const imageUrl =  this.userService.getUrlImagem(id)
    return imageUrl
   }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarCEP(cep: string): string {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}