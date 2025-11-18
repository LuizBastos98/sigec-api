import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoService } from './produto.service';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private http = inject(HttpClient);
  private produtoService = inject(ProdutoService);
  private API_URL = 'http://localhost:8080/api/vendas';

  constructor() { }

  public registrarVenda(vendaDTO: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registrar`, vendaDTO);
  }

  /**
   * Busca APENAS produtos ATIVOS para vender.
   */
  public getProdutosDisponiveis(): Observable<any[]> {
    // Passamos 'true' para filtrar
    return this.produtoService.getProdutos(true);
  }
}
