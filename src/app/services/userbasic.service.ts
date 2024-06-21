import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { UserBasic } from "../models/userbasic.model";

@Injectable({
    providedIn: 'root'
})
export class BasicUserService{
    private baseUrl = 'http://localhost:8080/basicUsers';

    constructor(private http: HttpClient) {}

    insert(userBasic: UserBasic): Observable<User>{
        const url = `${this.baseUrl}/register`;
        return this.http.post<User>(url, userBasic);
    }
}