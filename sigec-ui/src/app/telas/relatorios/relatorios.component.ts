import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// Módulos PrimeNG
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast'; // 1. IMPORTADO O MÓDULO

// Nossos Services
import { RelatorioService, FiltrosRelatorio } from '../../services/relatorio.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  // 2. ADICIONADO O MÓDULO AQUI
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    FieldsetModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    ToastModule, // <-- ADICIONADO
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
  providers: [CurrencyPipe, DatePipe]
})
export class RelatoriosComponent implements OnInit {

  // --- Nossas Variáveis ---
  public filtroForm: FormGroup;
  public vendas: any[] = [];
  public usuarios: any[] = [];

  // Somatórios (Módulo 2.5 do PDF)
  public totalVendasValor: number = 0;
  public totalVendasItens: number = 0;
  public totalVendasCount: number = 0;

  // Injeções
  private fb = inject(FormBuilder);
  private relatorioService = inject(RelatorioService);
  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);
  private datePipe = inject(DatePipe);

  constructor() {
    this.filtroForm = this.fb.group({
      dataInicial: [null],
      dataFinal: [null],
      valorMinimo: [null],
      valorMaximo: [null],
      usuarioId: [null]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
    this.onFiltrar(); // Carrega os dados iniciais (sem filtros)
  }

  /**
   * Carrega a lista de usuários para o dropdown de filtro
   */
  private carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios.map(u => ({
          label: u.nomeCompleto,
          value: u.id
        }));
      },
      (error) => {
        this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Não foi possível carregar o filtro de usuários.' });
      }
    );
  }

  /**
   * Chamado quando o usuário clica em "Filtrar"
   */
  public onFiltrar(): void {
    const filtros = this.formatarFiltros(this.filtroForm.value);

    this.relatorioService.buscarRelatorio(filtros).subscribe(
      (vendas) => {
        this.vendas = vendas;
        this.calcularSomatorios(); // Calcula os totais
      },
      (error) => {
        console.error('Erro ao buscar relatório:', error);
        // Agora este pop-up VAI APARECER
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar relatório.' });
      }
    );
  }

  /**
   * Limpa o formulário e busca novamente
   */
  public onLimpar(): void {
    this.filtroForm.reset();
    this.onFiltrar();
  }

  /**
   * Converte as datas para o formato (YYYY-MM-DD) que o backend (Spring/LocalDate) espera.
   */
  private formatarFiltros(filtros: any): FiltrosRelatorio {
    const { dataInicial, dataFinal, valorMinimo, valorMaximo, usuarioId } = filtros;

    return {
      dataInicial: dataInicial ? this.datePipe.transform(dataInicial, 'yyyy-MM-dd') : null,
      dataFinal: dataFinal ? this.datePipe.transform(dataFinal, 'yyyy-MM-dd') : null,
      valorMinimo,
      valorMaximo,
      usuarioId: usuarioId ? usuarioId.value : null
    };
  }

  /**
   * Calcula os somatórios (Módulo 2.5 do PDF)
   */
  private calcularSomatorios(): void {
    this.totalVendasCount = this.vendas.length;

    this.totalVendasValor = this.vendas.reduce((total, venda) => {
      return total + (venda.valorTotal || 0);
    }, 0);

    this.totalVendasItens = this.vendas.reduce((total, venda) => {
      const totalItensVenda = venda.itens.reduce((totalItens: number, item: any) => {
        return totalItens + (item.quantidade || 0);
      }, 0);
      return total + totalItensVenda;
    }, 0);
  }

}
