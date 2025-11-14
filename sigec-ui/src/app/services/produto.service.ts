import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private http = inject(HttpClient);
  // URL bate 100% com o seu ProdutoController
  private API_URL = 'http://localhost:8080/api/produtos';

  constructor() { }

  /**
   * GET /api/produtos
   */
  public getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  /**
   * GET /api/produtos/{id}
   */
  public getProdutoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  /**
   * POST /api/produtos
   */
  public criarProduto(produto: any): Observable<any> {
    return this.http.post<any>(this.API_URL, produto);
  }

  /**
   * PUT /api/produtos/{id}
   */
  public atualizarProduto(id: number, produto: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, produto);
  }

  /**
   * DELETE /api/produtos/{id}
   */
  public deletarProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
