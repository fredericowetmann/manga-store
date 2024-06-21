import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private baseUrl = 'http://localhost:8080/genres';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Genre[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Genre[]>(`${this.baseUrl}`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Genre> {
    return this.httpClient.get<Genre>(`${this.baseUrl}/${id}`);
  }

  insert(genre: Genre): Observable<Genre> {
    return this.httpClient.post<Genre>(this.baseUrl, genre);
  }
  
  update(genre: Genre): Observable<Genre> {
    return this.httpClient.put<Genre>(`${this.baseUrl}/${genre.id}`, genre);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}
