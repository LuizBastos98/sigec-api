import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/usuarios';

  constructor() { }

  public getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  public getUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  public criarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.API_URL, usuario);
  }

  public atualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, usuario);
  }

  public deletarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }

  public trocarStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/status`, {});
  }
}
