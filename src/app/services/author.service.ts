import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private baseUrl = 'http://localhost:8080/authors';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Author[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Author[]>(`${this.baseUrl}`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Author> {
    return this.httpClient.get<Author>(`${this.baseUrl}/${id}`);
  }

  insert(author: Author): Observable<Author> {
    return this.httpClient.post<Author>(this.baseUrl, author);
  }
  
  update(author: Author): Observable<Author> {
    return this.httpClient.put<Author>(`${this.baseUrl}/${author.id}`, author);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  } 



}
