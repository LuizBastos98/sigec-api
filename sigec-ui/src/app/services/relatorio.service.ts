import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

// Interface para definir o objeto de filtros
export interface FiltrosRelatorio {
  dataInicial?: string | null;
  dataFinal?: string | null;
  valorMinimo?: number | null;
  valorMaximo?: number | null;
  usuarioId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  private http = inject(HttpClient);

  // URL base do VendaController
  private API_URL = 'http://localhost:8080/api/vendas';

  constructor() { }

  /**
   * Busca o Relatório de Vendas com base nos filtros.
   * Chama o GET /api/vendas?filtro1=...&filtro2=...
   */
  public buscarRelatorio(filtros: FiltrosRelatorio): Observable<any[]> {

    // 1. Cria os parâmetros de URL
    let params = new HttpParams();

    // 2. Adiciona os filtros APENAS se eles existirem
    //    (O backend espera datas no formato YYYY-MM-DD)
    if (filtros.dataInicial) {
      params = params.append('dataInicial', filtros.dataInicial);
    }
    if (filtros.dataFinal) {
      params = params.append('dataFinal', filtros.dataFinal);
    }
    if (filtros.valorMinimo) {
      params = params.append('valorMinimo', filtros.valorMinimo.toString());
    }
    if (filtros.valorMaximo) {
      params = params.append('valorMaximo', filtros.valorMaximo.toString());
    }
    if (filtros.usuarioId) {
      params = params.append('usuarioId', filtros.usuarioId.toString());
    }

    // 3. Faz a chamada GET com os parâmetros
    //    (ex: /api/vendas?dataInicial=2025-01-01&usuarioId=1)
    return this.http.get<any[]>(this.API_URL, { params });
  }
}
