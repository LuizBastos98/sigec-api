import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router'; // 1. IMPORTE O ROUTERLINK

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
    RouterLink // 2. ADICIONE AQUI
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
      this.nomeUsuario = userData.nome.split(' ')[0]; // Pega só o primeiro nome
      this.roleUsuario = userData.role;
    }
  }

  private carregarEstatisticas(): void {
    // forkJoin: Faz as 3 chamadas em paralelo e espera todas terminarem
    forkJoin({
      usuarios: this.usuarioService.getUsuarios(),
      produtos: this.produtoService.getProdutos(),
      // Busca todas as vendas (sem filtro)
      vendas: this.relatorioService.buscarRelatorio({})
    }).subscribe({
      next: (resultado) => {
        // 1. Conta Usuários
        this.qtdUsuarios = resultado.usuarios.length;

        // 2. Conta Produtos
        this.qtdProdutos = resultado.produtos.length;

        // 3. Soma o Valor Total Vendido
        this.totalVendas = resultado.vendas.reduce((total: number, venda: any) => {
          return total + (venda.valorTotal || 0);
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas do dashboard', err);
      }
    });
  }
}
