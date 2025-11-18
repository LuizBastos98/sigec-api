import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/produtos';

  constructor() { }

  /**
   * Busca produtos. Se somenteAtivos=true, traz apenas os ativos.
   */
  public getProdutos(somenteAtivos: boolean = false): Observable<any[]> {
    let url = this.API_URL;
    if (somenteAtivos) {
      url += '?somenteAtivos=true';
    }
    return this.http.get<any[]>(url);
  }

  public getProdutoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  public criarProduto(produto: any): Observable<any> {
    return this.http.post<any>(this.API_URL, produto);
  }

  public atualizarProduto(id: number, produto: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, produto);
  }

  public deletarProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }

  public trocarStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/status`, {});
  }
}
