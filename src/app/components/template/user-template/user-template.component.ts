import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-user-template',
  standalone: true,
  providers: [CartService, OrderService],
  imports: [UserHeaderComponent, FooterComponent, RouterOutlet, MatButton, MatIcon],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}