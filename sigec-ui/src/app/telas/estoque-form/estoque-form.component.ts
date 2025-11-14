import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

// Services
import { EstoqueService } from '../../services/estoque.service';
import { ProdutoService } from '../../services/produto.service';

// Módulos PrimeNG
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-estoque-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    ToolbarModule, ButtonModule, DropdownModule, InputNumberModule,
    InputTextareaModule, MessageModule
  ],
  templateUrl: './estoque-form.component.html',
  styleUrl: './estoque-form.component.scss'
})
export class EstoqueFormComponent implements OnInit {

  public movimentacaoForm: FormGroup;
  public errorMessage: string | null = null;
  public produtos: any[] = [];
  public tiposMovimentacao: any[] = [];
  private usuarioLogadoId: number | null = null;

  private fb = inject(FormBuilder);
  private estoqueService = inject(EstoqueService);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    this.tiposMovimentacao = [
      { label: 'Entrada (Reposição)', value: 'ENTRADA' },
      { label: 'Ajuste (Correção)', value: 'AJUSTE' }
    ];

    this.movimentacaoForm = this.fb.group({
      produtoId: [null, [Validators.required]],
      tipo: [null, [Validators.required]],

      // --- *** CORREÇÃO AQUI *** ---
      // Removemos o "Validators.min(1)"
      quantidade: [null, [Validators.required]],

      motivo: [''],
      usuarioId: [null]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarUsuarioLogado();
    this.configurarValidacaoMotivo();
  }

  private carregarUsuarioLogado(): void {
    const userDataStorage = localStorage.getItem('userData');
    if (userDataStorage) {
      const userData = JSON.parse(userDataStorage);
      this.usuarioLogadoId = userData.id;
      this.movimentacaoForm.patchValue({ usuarioId: this.usuarioLogadoId });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe(
      (produtos) => {
        this.produtos = produtos.map(p => ({
          label: `${p.nome} (Estoque atual: ${p.quantidadeEmEstoque})`,
          value: p.id
        }));
      },
      (error) => {
        this.errorMessage = "Erro ao carregar produtos. A tela de produtos está funcionando?";
      }
    );
  }

  private configurarValidacaoMotivo(): void {
    const motivoControl = this.movimentacaoForm.get('motivo');

    this.movimentacaoForm.get('tipo')?.valueChanges.subscribe(tipo => {
      if (tipo === 'AJUSTE') {
        motivoControl?.setValidators([Validators.required, Validators.minLength(5)]);
      } else {
        motivoControl?.clearValidators();
      }
      motivoControl?.updateValueAndValidity();
    });
  }


  public onSubmit(): void {
    this.errorMessage = null;
    if (this.movimentacaoForm.invalid) {
      this.movimentacaoForm.markAllAsTouched();
      this.errorMessage = "Formulário inválido. Verifique os campos.";
      return;
    }

    const dados = this.movimentacaoForm.value;

    // Agora esta lógica será executada
    if (dados.tipo === 'AJUSTE') {
      if (dados.quantidade === 0) {
        this.errorMessage = "A quantidade para AJUSTE não pode ser zero.";
        return;
      }
    } else if (dados.tipo === 'ENTRADA') {
      if (dados.quantidade <= 0) {
        this.errorMessage = "Para ENTRADA, a quantidade deve ser positiva.";
        return;
      }
    }

    console.log('Enviando para o backend:', dados);

    this.estoqueService.registrarMovimentacao(dados).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Movimentação registrada com sucesso!'
        });
        this.router.navigate(['/app/estoque']);
      },
      (error) => {
        console.error('Erro ao registrar movimentação:', error);
        this.errorMessage = "Falha ao registrar. Verifique o console para mais detalhes.";
      }
    );
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.movimentacaoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
