import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private baseUrl = 'http://localhost:8080/cities';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<City[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<City[]>(`${this.baseUrl}`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }


  findById(id: string): Observable<City> {
    return this.httpClient.get<City>(`${this.baseUrl}/${id}`);
  }

  insert(city: City): Observable<City> {
    const data = {
      name: city.name,
      idState: city.state.id
    }
    return this.httpClient.post<City>(this.baseUrl, data);
  }
  
  update(city: City): Observable<City> {
    const data = {
      name: city.name,
      idState: city.state.id
    }
    return this.httpClient.put<City>(`${this.baseUrl}/${city.id}`, data);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}
