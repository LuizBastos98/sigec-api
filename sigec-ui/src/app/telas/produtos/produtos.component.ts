import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // 1. IMPORTADO O ROUTERLINK

// Imports do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

// Nosso Service
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, // 2. ADICIONADO AQUI
    TableModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {

  public produtos: any[] = [];

  // Injeções
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.carregarProdutos();
  }

  public carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe(
      (response) => {
        this.produtos = response;
        console.log('Produtos carregados:', this.produtos);
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar produtos.'
        });
      }
    );
  }

  public novoProduto(): void {
    // Navega para /app/estoque/novo
    this.router.navigate(['/app/estoque/novo']);
  }

  public editarProduto(id: number): void {
    // Navega para /app/estoque/1 (ou o id clicado)
    this.router.navigate(['/app/estoque', id]);
  }

  public excluirProduto(id: number, nome: string): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto "${nome}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.produtoService.deletarProduto(id).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto excluído com sucesso!'
            });
            this.carregarProdutos(); // Recarrega a lista
          },
          (error) => {
            console.error('Erro ao excluir produto:', error);
            // Mensagem de erro (ex: produto com venda vinculada)
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.error?.message || 'Falha ao excluir produto.'
            });
          }
        );
      }
    });
  }
}
