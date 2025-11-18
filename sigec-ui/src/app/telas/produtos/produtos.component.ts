import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Imports do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip'; // Adicionado
import { ConfirmationService, MessageService } from 'primeng/api';

// Nosso Service
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule // Adicionado
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
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar produtos.' });
      }
    );
  }

  public novoProduto(): void {
    this.router.navigate(['/app/estoque/novo']);
  }

  public editarProduto(id: number): void {
    this.router.navigate(['/app/estoque', id]);
  }

  // --- MÉTODO ALTERADO (era 'excluirProduto') ---
  public alternarStatus(produto: any): void {
    const acao = produto.ativo ? 'desativar' : 'ativar';

    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${acao} o produto "${produto.nome}"?`,
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Chama o service de produto
        this.produtoService.trocarStatus(produto.id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Status alterado com sucesso!' });
            this.carregarProdutos(); // Recarrega a lista
          },
          (error) => {
            console.error('Erro:', error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao alterar status.' });
          }
        );
      }
    });
  }
}
