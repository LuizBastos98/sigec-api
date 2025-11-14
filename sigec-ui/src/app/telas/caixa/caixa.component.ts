import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Importa o CurrencyPipe
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

// Módulos PrimeNG para esta tela
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';

// Nossos Services
import { VendaService } from '../../services/venda.service';

// Interfaces (modelos) para nos ajudar no código
interface ProdutoDisponivel {
  id: number;
  label: string; // <-- Mudança aqui
  precoUnitario: number;
  estoqueAtual: number;
}

interface ItemCarrinho {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-caixa',
  standalone: true,
  // 1. Importa todos os módulos que vamos usar
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    MessageModule,
    CurrencyPipe // Importa o Pipe para formatar R$
  ],
  templateUrl: './caixa.component.html',
  styleUrl: './caixa.component.scss',
  providers: [CurrencyPipe] // Disponibiliza o Pipe no componente
})
export class CaixaComponent implements OnInit {

  // --- Nossas Variáveis de Estado ---
  public produtosDisponiveis: ProdutoDisponivel[] = []; // Lista para o dropdown
  public carrinho: ItemCarrinho[] = []; // Nosso "carrinho" de compras
  public totalVenda: number = 0;
  public troco: number = 0;

  public formItem: FormGroup; // Formulário para "Adicionar Item"
  public formPagamento: FormGroup; // Formulário para "Finalizar Venda"

  public errorMessage: string | null = null;
  private usuarioLogadoId: number | null = null;

  // --- Injeções ---
  private fb = inject(FormBuilder);
  private vendaService = inject(VendaService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    // Formulário para adicionar um item ao carrinho
    this.formItem = this.fb.group({
      produto: [null, [Validators.required]], // O 'produto' aqui será o objeto ProdutoDisponivel
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });

    // Formulário para registrar o pagamento
    this.formPagamento = this.fb.group({
      valorRecebido: [null, [Validators.required, Validators.min(0)]]
    });
  }

  // --- Métodos do Ciclo de Vida ---
  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarUsuarioLogado();
    this.observarMudancasPagamento();
  }

  // --- Métodos de Carregamento ---
  private carregarUsuarioLogado(): void {
    const userDataStorage = localStorage.getItem('userData');
    if (userDataStorage) {
      const userData = JSON.parse(userDataStorage);
      this.usuarioLogadoId = userData.id;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Usuário não identificado. Faça login novamente.' });
      this.router.navigate(['/login']);
    }
  }

  private carregarProdutos(): void {
    this.vendaService.getProdutosDisponiveis().subscribe(
      (produtos) => {
        // Mapeia os dados do backend para o formato que precisamos
        this.produtosDisponiveis = produtos.map(p => ({
          id: p.id,
          // --- *** CORREÇÃO AQUI *** ---
          // A propriedade DEVE ser 'label' (como o HTML espera)
          label: `${p.nome} (Estoque: ${p.quantidadeEmEstoque})`,
          precoUnitario: p.precoUnitario,
          estoqueAtual: p.quantidadeEmEstoque
        }));
      },
      (error) => {
        this.errorMessage = "Erro fatal ao carregar produtos. O backend está rodando?";
      }
    );
  }

  // --- Métodos do Carrinho ---
  public adicionarAoCarrinho(): void {
    if (this.formItem.invalid) return;

    const { produto, quantidade } = this.formItem.value;

    // 1. Validação de Estoque
    if (quantidade > produto.estoqueAtual) {
      this.errorMessage = `Estoque insuficiente para "${produto.label}". Disponível: ${produto.estoqueAtual}`;
      return;
    }

    // 2. Verifica se o item já está no carrinho
    const itemExistente = this.carrinho.find(item => item.produtoId === produto.id);

    if (itemExistente) {
      // 3. Se existe, atualiza a quantidade (e checa o estoque de novo)
      const novaQtd = itemExistente.quantidade + quantidade;
      if (novaQtd > produto.estoqueAtual) {
        this.errorMessage = `Estoque insuficiente para "${produto.label}". Você já tem ${itemExistente.quantidade} no carrinho. Disponível: ${produto.estoqueAtual}`;
        return;
      }
      itemExistente.quantidade = novaQtd;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
      // 4. Se não existe, adiciona o novo item
      this.carrinho.push({
        produtoId: produto.id,
        nome: produto.label.split(' (Estoque:')[0], // Pega só o nome
        quantidade: quantidade,
        precoUnitario: produto.precoUnitario,
        subtotal: quantidade * produto.precoUnitario
      });
    }

    // 5. Limpa os campos e o erro
    this.errorMessage = null;
    this.formItem.reset({ quantidade: 1 }); // Reseta o form, mas mantém qtd 1
    this.recalcularTotal();
  }

  public removerDoCarrinho(produtoId: number): void {
    this.carrinho = this.carrinho.filter(item => item.produtoId !== produtoId);
    this.recalcularTotal();
  }

  // --- Métodos de Cálculo ---
  private recalcularTotal(): void {
    this.totalVenda = this.carrinho.reduce((total, item) => total + item.subtotal, 0);
    this.formPagamento.get('valorRecebido')?.updateValueAndValidity(); // Força o recálculo do troco
  }

  private observarMudancasPagamento(): void {
    // Fica "ouvindo" o campo 'valorRecebido' para calcular o troco em tempo real
    this.formPagamento.get('valorRecebido')?.valueChanges.subscribe(valor => {
      if (valor !== null && valor >= this.totalVenda) {
        this.troco = valor - this.totalVenda;
      } else {
        this.troco = 0;
      }
    });
  }

  // --- Método Principal: Finalizar a Venda ---
  public finalizarVenda(): void {
    if (this.carrinho.length === 0) {
      this.errorMessage = "O carrinho está vazio.";
      return;
    }
    if (this.formPagamento.invalid) {
      this.errorMessage = "Valor recebido é obrigatório.";
      return;
    }

    const valorRecebido = this.formPagamento.get('valorRecebido')?.value;
    if (valorRecebido < this.totalVenda) {
      this.errorMessage = "Valor recebido é menor que o total da venda.";
      return;
    }

    // 1. Monta o DTO de Itens
    const itensDTO = this.carrinho.map(item => ({
      produtoId: item.produtoId,
      quantidade: item.quantidade
    }));

    // 2. Monta o DTO da Venda (VendaRequestDTO)
    const vendaDTO = {
      usuarioId: this.usuarioLogadoId,
      valorRecebido: valorRecebido,
      itens: itensDTO
    };

    // 3. Envia para o Backend
    this.vendaService.registrarVenda(vendaDTO).subscribe(
      (response) => {
        // Sucesso!
        const trocoFormatado = (response.troco || 0).toFixed(2).replace('.', ',');

        this.messageService.add({
          severity: 'success',
          summary: 'Venda Registrada!',
          detail: `Troco: R$ ${trocoFormatado}`,
          life: 5000 // Fica por 5 segundos
        });

        this.resetarCaixa();
        this.carregarProdutos(); // Recarrega os produtos (com estoque atualizado)
      },
      (error) => {
        // Erro (ex: "Estoque insuficiente", vindo do seu Service)
        console.error('Erro ao registrar venda:', error);
        this.errorMessage = error.error?.message || error.message || "Erro inesperado ao salvar a venda.";
      }
    );
  }

  private resetarCaixa(): void {
    this.carrinho = [];
    this.totalVenda = 0;
    this.troco = 0;
    this.errorMessage = null;
    this.formItem.reset({ quantidade: 1 });
    this.formPagamento.reset();
  }

  // --- Funções Auxiliares para o HTML ---
  public isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
