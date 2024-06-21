import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection } from '../models/collection.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private baseUrl = 'http://localhost:8080/collections';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Collection[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Collection[]>(`${this.baseUrl}`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  getUrlImagem(imageName: string): string {
    return `${this.baseUrl}/image/download/${imageName}`;
  }

  salvarImagem(id: number, imageName: string, imagem: File): Observable<any> {
    const form: FormData = new FormData();
    form.append('id', id.toString());
    form.append('imageName', imagem.name);
    form.append('image', imagem, imagem.name); 
    
    return this.httpClient.patch(`${this.baseUrl}/image/upload`, form);
  }

  findById(id: string): Observable<Collection> {
    return this.httpClient.get<Collection>(`${this.baseUrl}/${id}`);
  }

  insert(collection: Collection): Observable<Collection> {
    return this.httpClient.post<Collection>(this.baseUrl, collection);
  }
  
  update(collection: Collection): Observable<Collection> {
    return this.httpClient.put<Collection>(`${this.baseUrl}/${collection.id}`, collection);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  } 

}
