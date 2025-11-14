import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base da sua API Spring Boot.
  // (Confirme se a porta é 8080 mesmo)
  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }


  public login(dadosLogin: any): Observable<any> {
    // Faz o POST para http://localhost:8080/api/auth/login
    return this.http.post<any>(`${this.API_URL}/login`, dadosLogin);
  }

}
