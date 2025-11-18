import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  public usuarios: any[] = [];

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
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar usuários.' });
      }
    );
  }

  public novoUsuario(): void {
    this.router.navigate(['/app/usuarios/novo']);
  }

  public editarUsuario(id: number): void {
    this.router.navigate(['/app/usuarios', id]);
  }

  // --- MÉTODO ALTERADO ---
  public alternarStatus(usuario: any): void {
    const acao = usuario.status === 'ATIVO' ? 'desativar' : 'ativar';

    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${acao} o usuário "${usuario.nomeCompleto}"?`,
      header: 'Confirmar Ação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.usuarioService.trocarStatus(usuario.id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Status alterado com sucesso!` });
            this.carregarUsuarios();
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao alterar status.' });
          }
        );
      }
    });
  }
}
