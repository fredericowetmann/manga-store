import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publisher } from '../models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private baseUrl = 'http://localhost:8080/publishers';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Publisher[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Publisher[]>(`${this.baseUrl}`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Publisher> {
    return this.httpClient.get<Publisher>(`${this.baseUrl}/${id}`);
  }

  insert(publisher: Publisher): Observable<Publisher> {
    return this.httpClient.post<Publisher>(this.baseUrl, publisher);
  }
  
  update(publisher: Publisher): Observable<Publisher> {
    return this.httpClient.put<Publisher>(`${this.baseUrl}/${publisher.id}`, publisher);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  } 



}
