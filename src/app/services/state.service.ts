import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private baseUrl = 'http://localhost:8080/states';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<State[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<State[]>(`${this.baseUrl}`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<State> {
    return this.httpClient.get<State>(`${this.baseUrl}/${id}`);
  }

  insert(state: State): Observable<State> {
    return this.httpClient.post<State>(this.baseUrl, state);
  }
  
  update(state: State): Observable<State> {
    return this.httpClient.put<State>(`${this.baseUrl}/${state.id}`, state);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}
