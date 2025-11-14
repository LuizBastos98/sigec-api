import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

// Services
import { ProdutoService } from '../../services/produto.service';

// Módulos PrimeNG para o formulário
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    ToolbarModule, ButtonModule, InputTextModule, MessageModule,
    TooltipModule, InputNumberModule
  ],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss'
})
export class ProdutoFormComponent implements OnInit {

  public produtoForm: FormGroup;
  public errorMessage: string | null = null;
  public isEditMode: boolean = false;
  private currentProdutoId: number | null = null;

  // Injeções
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  constructor() {
    this.produtoForm = this.fb.group({
      id: [null],
      codigo: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      categoria: [''],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidadeEmEstoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // --- MODO EDIÇÃO ---
      this.isEditMode = true;
      this.currentProdutoId = +idParam;

      this.produtoForm.get('quantidadeEmEstoque')?.disable();

      this.produtoService.getProdutoPorId(this.currentProdutoId).subscribe(
        (produto) => {
          this.produtoForm.patchValue(produto);
        },
        (error) => {
          console.error('Erro ao buscar produto:', error);
          this.errorMessage = "Produto não encontrado.";
        }
      );
    }
  }

  public onSubmit(): void {
    this.errorMessage = null;
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      this.errorMessage = "Formulário inválido. Verifique os campos em vermelho.";
      return;
    }

    const dadosProduto = this.produtoForm.getRawValue();

    const operacao = this.isEditMode
      ? this.produtoService.atualizarProduto(this.currentProdutoId!, dadosProduto)
      : this.produtoService.criarProduto(dadosProduto);

    operacao.subscribe(
      () => {
        const msg = `Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
        this.router.navigate(['/app/estoque']);
      },
      (error) => {
        console.error('Erro ao salvar produto:', error);
        if (error.status === 400 || error.status === 409) {
          this.errorMessage = "Erro ao salvar: Código de produto já cadastrado ou dados inválidos.";
        } else {
          this.errorMessage = "Erro inesperado ao salvar. Tente novamente.";
        }
      }
    );
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.produtoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
//teste
