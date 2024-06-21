import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manga } from '../models/manga.model';

@Injectable({
  providedIn: 'root'
})
export class MangaService {
  private baseUrl = 'http://localhost:8080/mangas';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Manga[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Manga[]>(`${this.baseUrl}`, {params});
  }

  findByName(name: string, page?: number, pageSize?: number): Observable<Manga[]> {
    let params = {};
    console.log(page, pageSize)
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page,
        pageSize: pageSize
      }
    }
    return this.httpClient.get<Manga[]>(`${this.baseUrl}/search/name/${name}`, {params});
  }

  findByGenre(genreId: number, page?: number, pageSize?: number): Observable<Manga[]> {
    let params = {};
    console.log(page, pageSize)
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page,
        pageSize: pageSize
      }
    }
    return this.httpClient.get<Manga[]>(`${this.baseUrl}/search/genero/${genreId}`, {params});
  }

  findByCollection(id: number, page?: number, pageSize?: number): Observable<Manga[]> {
    let params = {};
    console.log(page, pageSize)
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page,
        pageSize: pageSize
      }
    }
    return this.httpClient.get<Manga[]>(`${this.baseUrl}/search/colecao/${id}`, {params});
  }

  findAllRandom(page?: number, pageSize?: number): Observable<Manga[]> {
     // variavel de escopo de bloco
     let params = {};

     if (page !== undefined && pageSize !== undefined) {
       params = {
         page: page.toString(),
         pageSize: pageSize.toString()
       }
     }
     return this.httpClient.get<Manga[]>(`${this.baseUrl}/random`, {params});
   }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByName(name: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/name/${name}`);
  }

  countByGenre(genre: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/genre/${genre}`);
  }

  countByCollection(collection: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/collection/${collection}`);
  }

  getUrlImagem(name: string): string {
    return `${this.baseUrl}/image/download/${name}`;
  }

  salvarImagem(idManga: number, imageName: string, image: File): Observable<any> {
    const form: FormData = new FormData();
    form.append('id', idManga.toString())
    form.append('imageName', image.name);
    form.append('image', image, image.name);
    
    return this.httpClient.patch(`${this.baseUrl}/image/upload/`, form);
  }

  findById(id: string): Observable<Manga> {
    console.log(id)
    return this.httpClient.get<Manga>(`${this.baseUrl}/${id}`);
  }

  insert(manga: Manga): Observable<Manga> {
    
    const obj = {
      name: manga.name,
      description: manga.description,
      price: manga.price,
      inventory: manga.inventory,
      numPages: manga.numPages,
      volume: manga.volume,
      collection: manga.collection.id,
      publisher: manga.publisher.id,
      author: manga.author.id,
      listGenre: manga.listGenre
    }

    return this.httpClient.post<Manga>(this.baseUrl, obj);
  }
  
  update(manga: Manga): Observable<Manga> {
    const obj = {
      name: manga.name,
      description: manga.description,
      price: manga.price,
      inventory: manga.inventory,
      numPages: manga.numPages,
      volume: manga.volume,
      collection: manga.collection.id,
      publisher: manga.publisher.id,
      author: manga.author.id,
      listGenre: manga.listGenre
    }
    return this.httpClient.put<Manga>(`${this.baseUrl}/${manga.id}`, obj);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}