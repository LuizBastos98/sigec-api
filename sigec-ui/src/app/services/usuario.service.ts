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

  // GET /api/usuarios
  public getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // GET /api/usuarios/{id}
  public getUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // POST /api/usuarios
  public criarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.API_URL, usuario);
  }

  // PUT /api/usuarios/{id}
  public atualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, usuario);
  }

  /**
   * (NOVO) Deleta um usuário
   * DELETE /api/usuarios/{id}
   */
  public deletarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
