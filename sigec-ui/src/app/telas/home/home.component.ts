import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs'; // Importe o 'of' também
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

  public nomeUsuario: string = '';
  public totalVendas: number = 0;
  public qtdProdutos: number = 0;
  public qtdUsuarios: number = 0;
  public roleUsuario: string = '';

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
    const requisicoes: any = {
      produtos: this.produtoService.getProdutos(),
      vendas: this.relatorioService.buscarRelatorio({})
    };

    // 2. Se for ADMIN, adiciona a requisição de usuários
    // (Se for Operador, não pedimos, para não dar erro 403)
    if (this.roleUsuario === 'ADMIN') {
      requisicoes.usuarios = this.usuarioService.getUsuarios();
    } else {
      // Se não for admin, retornamos uma lista vazia "fake" para não quebrar a lógica
      requisicoes.usuarios = of([]);
    }

    // 3. Executa o forkJoin
    forkJoin(requisicoes).subscribe({
      next: (resultado: any) => {
        // Agora é seguro ler os dados

        // Se 'usuarios' existir no resultado, pega o length. Se não, é 0.
        this.qtdUsuarios = resultado.usuarios ? resultado.usuarios.length : 0;

        this.qtdProdutos = resultado.produtos.length;

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
