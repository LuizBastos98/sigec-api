import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs'; // Importe o 'of'
import { catchError } from 'rxjs/operators'; // Importe o 'catchError'
import { RouterLink } from '@angular/router';

// Módulos PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Services
import { UsuarioService } from '../../services/usuario.service';
import { ProdutoService } from '../../services/produto.service';
import { RelatorioService } from '../../services/relatorio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  // Variáveis para o Dashboard
  public nomeUsuario: string = '';
  public totalVendas: number = 0;
  public qtdProdutos: number = 0;
  public qtdUsuarios: number = 0;
  public roleUsuario: string = '';

  // Injeções
  private usuarioService = inject(UsuarioService);
  private produtoService = inject(ProdutoService);
  private relatorioService = inject(RelatorioService);

  ngOnInit(): void {
    this.carregarDadosUsuario();
    this.carregarEstatisticas();
  }

  private carregarDadosUsuario(): void {
    const userDataStorage = localStorage.getItem('userData');
    if (userDataStorage) {
      const userData = JSON.parse(userDataStorage);
      this.nomeUsuario = userData.nome.split(' ')[0];
      this.roleUsuario = userData.role;
    }
  }

  private carregarEstatisticas(): void {
    // 1. Define as requisições que TODO MUNDO pode fazer
    // Usamos o pipe(catchError) para que, se uma falhar, não quebre tudo
    const requisicoes: any = {
      produtos: this.produtoService.getProdutos().pipe(catchError(() => of([]))),
      vendas: this.relatorioService.buscarRelatorio({}).pipe(catchError(() => of([])))
    };

    // 2. Se for ADMIN, adiciona a requisição de usuários
    if (this.roleUsuario === 'ADMIN') {
      requisicoes.usuarios = this.usuarioService.getUsuarios().pipe(catchError(() => of([])));
    } else {
      // Se não for admin, retornamos uma lista vazia "fake"
      requisicoes.usuarios = of([]);
    }

    // 3. Executa o forkJoin
    forkJoin(requisicoes).subscribe({
      next: (resultado: any) => {
        // Agora é seguro ler os dados
        this.qtdUsuarios = resultado.usuarios ? resultado.usuarios.length : 0;
        this.qtdProdutos = resultado.produtos ? resultado.produtos.length : 0;

        this.totalVendas = resultado.vendas ? resultado.vendas.reduce((total: number, venda: any) => {
          return total + (venda.valorTotal || 0);
        }, 0) : 0;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas do dashboard', err);
      }
    });
  }
}

