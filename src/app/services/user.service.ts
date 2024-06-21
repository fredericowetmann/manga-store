import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/users';

  constructor(private httpClient: HttpClient,
              private authService: AuthService
  ) {  }

  updateUser(userId: number, user: any): Observable<any> {
    const UpdateUserDTO = {
      name: user.name,
      email: user.email,
      cpf: user.cpf
    }
    return this.httpClient.put(`${this.baseUrl}/${userId}/update`, UpdateUserDTO);
  }

  updatePassword(userId: number, passwordData: any): Observable<any> {
    const updatePasswordDTO = {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    }
    console.log(updatePasswordDTO.newPassword)
    return this.httpClient.put(`${this.baseUrl}/${userId}/password`, updatePasswordDTO);
  }

  findAll(page?: number, pageSize?: number): Observable<User[]> {
    // variavel de escopo de bloco
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<User[]>(`${this.baseUrl}`, {params});
  }

  findById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
  }

  findProfiles(): Observable<Profile[]> {
    return this.httpClient.get<Profile[]>(`${this.baseUrl}/profiles`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  getUrlImagem(id: number): string {
    return `${this.baseUrl}/image/download/${id}`; 
  }

  salvarImagem(id: number, imageName: string, image: File): Observable<any> {
    const form: FormData = new FormData();
    form.append('id', id.toString())
    form.append('imageName', image.name);
    form.append('image', image, image.name);
    
    return this.httpClient.patch(`${this.baseUrl}/image/upload`, form);
  }

  insert(user: any): Observable<User> {
    const address = {
      name: user.address.name,
      postalCode: user.address.postalCode,
      address: user.address.address,
      complement: user.address.complement,
      city: user.address.city.id
    }
    console.log(address)
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
      cpf: user.cpf, 
      idProfile: user.profile.id,
      address: address
    }
    console.log(data)
    return this.httpClient.post<User>(this.baseUrl, data);
  }
  
  update(user: any): Observable<User> {
    const address = {
      name: user.address.name,
      postalCode: user.address.postalCode,
      address: user.address.address,
      complement: user.address.complement,
      city: user.address.city.id
    }
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
      cpf: user.cpf, 
      idProfile: user.profile.id,
      address: address
    }
    return this.httpClient.put<User>(`${this.baseUrl}/${user.id}`, data);
  }

  delete(id: number): Observable<void> { // Alteração aqui
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}
