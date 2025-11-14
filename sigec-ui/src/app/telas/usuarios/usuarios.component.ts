import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Imports do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip'; // (Adicionando Tooltip)

// 1. IMPORTE OS SERVIÇOS
import { ConfirmationService, MessageService } from 'primeng/api';

// Nosso Service
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule // (Adicionando Tooltip)
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  public usuarios: any[] = [];

  // 2. INJETE OS SERVIÇOS
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  public carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (response) => {
        this.usuarios = response;
        console.log('Usuários carregados:', this.usuarios);
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar usuários.'
        });
      }
    );
  }

  public novoUsuario(): void {
    this.router.navigate(['/app/usuarios/novo']);
  }

  public editarUsuario(id: number): void {
    this.router.navigate(['/app/usuarios', id]);
  }

  /**
   * (NOVO) Lógica de Exclusão com Confirmação
   */
  public excluirUsuario(id: number, nome: string): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Usuário clicou "Sim"
        this.usuarioService.deletarUsuario(id).subscribe(
          () => {
            // Sucesso!
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário excluído com sucesso!'
            });
            // Recarrega a lista
            this.carregarUsuarios();
          },
          (error) => {
            // Erro!
            console.error('Erro ao excluir usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao excluir usuário.'
            });
          }
        );
      }
      // Se rejeitar, o pop-up simplesmente fecha.
    });
  }
}
