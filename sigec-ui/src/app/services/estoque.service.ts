import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private http = inject(HttpClient);
  // URL base do seu MovimentacaoEstoqueController
  private API_URL = 'http://localhost:8080/api/estoque';

  constructor() { }

  /**
   * Envia uma nova movimentação (ENTRADA/AJUSTE) para o backend
   * POST /api/estoque/movimentar
   */
  public registrarMovimentacao(movimentacaoDTO: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/movimentar`, movimentacaoDTO);
  }
}
