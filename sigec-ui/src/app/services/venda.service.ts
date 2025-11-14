import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Service
import { ProdutoService } from './produto.service'; // Vamos precisar dele

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private http = inject(HttpClient);
  private produtoService = inject(ProdutoService); // Injetamos o service de produto

  // URL base do VendaController
  private API_URL = 'http://localhost:8080/api/vendas';

  constructor() { }

  /**
   * Registra a Venda completa (Caixa).
   * Chama o POST /api/vendas/registrar
   * * @param vendaDTO O VendaRequestDTO
   */
  public registrarVenda(vendaDTO: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registrar`, vendaDTO);
  }

  /**
   * Método auxiliar para a tela de Caixa.
   * Busca a lista de produtos disponíveis para venda.
   * (Ele apenas repassa a chamada para o ProdutoService)
   */
  public getProdutosDisponiveis(): Observable<any[]> {
    // Reutilizamos o service que já temos pronto!
    return this.produtoService.getProdutos();
  }
}
