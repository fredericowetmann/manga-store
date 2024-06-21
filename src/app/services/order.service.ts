import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8080/orders';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getOrderById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  findByUser(userId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }
}
