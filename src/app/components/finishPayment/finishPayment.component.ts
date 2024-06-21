import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Payment } from '../../models/payment.model';
import { AuthService } from '../../services/auth.service';
import { ItemOrder } from '../../models/itemorder.model';
import { ItemCart } from '../../models/itemcart.model';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';
import { City } from '../../models/city.model';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-finish-payment',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule, MatCheckboxModule, MatIconModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class FinishPaymentComponent implements OnInit {
    formGroup: FormGroup;
    payment: any
    user: any;
    city: City[] = []

    itens: ItemCart[] = [];
    currentDate = new Date();
    itemOrder: ItemOrder[] = [];

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cityService: CityService,
    private location: Location
){
  const payment: Payment = this.payment

  this.formGroup = fb.group({
    cardNumber: [(payment && payment.cardNumber) ? payment.cardNumber : '', 
          Validators.compose([Validators.required])],
    cardCvv: [(payment && payment.cardCvv) ? payment.cardCvv : '', 
          Validators.compose([Validators.required])],
    cardHolderName: [(payment && payment.cardHolderName) ? payment.cardHolderName : '', 
          Validators.compose([Validators.required])],
    cardExpiration: [(payment && payment.cardExpiration) ? payment.cardExpiration : '', 
          Validators.compose([Validators.required])],
    
    addressName: ['', Validators.required],
    addressPostalCode: ['', Validators.required],
    addressAddress: ['', Validators.required],
    addressComplement: ['', Validators.required],
    addressCity: [null],
    });
  }

  initializeForm() {
    const payment: Payment = this.payment

    const user: User = this.user
    const city = this.city
      .find(city => city.id === (user?.address.city?.id || null)); 

  this.formGroup = this.fb.group({
    cardNumber: [(payment && payment.cardNumber) ? payment.cardNumber : '', 
        Validators.compose([Validators.required,
                            Validators.minLength(16),
                            Validators.maxLength(16),
                            Validators.pattern('^[0-9]*$')
        ])],
    cardCvv: [(payment && payment.cardCvv) ? payment.cardCvv : '', 
        Validators.compose([Validators.required,
                            Validators.minLength(3),
                            Validators.maxLength(3),
                            Validators.pattern('^[0-9]*$')
        ])],
    cardHolderName: [(payment && payment.cardHolderName) ? payment.cardHolderName : '', 
        Validators.compose([Validators.required])],
    cardExpiration: [(payment && payment.cardExpiration) ? payment.cardExpiration : '', 
        Validators.compose([Validators.required,
                            Validators.minLength(4),
                            Validators.maxLength(4),
                            Validators.pattern('^[0-9]*$')
        ])],

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
    this.cartService.cart$.subscribe( itens => {
        this.itens = itens;
      })
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

  finalizarCompra() {
    if (!this.user || !this.user.cpf) {
        console.error('O usuário não possui CPF cadastrado');
        this.showSnackbarTopPosition('Por favor, cadastre seu CPF antes de concluir a compra.', 'Fechar');
        this.router.navigate(['/profile/update']);
        return;
    }
    for (let i = 0; i < this.itens.length; i++) {
      const item: ItemOrder = {
      quantity: this.itens[i].quantity,
      price: this.itens[i].price,
      idManga: this.itens[i].id
      }
      this.itemOrder.push(item)
    }
    this.cartService.insert(this.itemOrder, this.formGroup.value)
    if (this.user.profile.label === 'Admin'){
        this.router.navigateByUrl('/admin/profile/orders');
        this.showSnackbarTopPosition('Compra realizada com sucesso', 'Fechar');
      } else {
        this.router.navigateByUrl('/profile/orders');
        this.showSnackbarTopPosition('Compra realizada com sucesso', 'Fechar');
      }
  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 4000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  voltarPagina() {
    this.location.back();
  }
}