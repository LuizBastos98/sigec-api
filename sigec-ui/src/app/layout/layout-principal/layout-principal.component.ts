import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router'; // Importa RouterLink e RouterOutlet

// Módulos do PrimeNG que vamos usar
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-layout-principal',
  standalone: true,
  // 1. Importe TODOS os módulos que este componente usa
  imports: [
    CommonModule,
    RouterOutlet, // Onde as telas (home, usuários) serão carregadas
    RouterLink,   // Para os links do menu
    SidebarModule,
    ButtonModule,
    AvatarModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './layout-principal.component.html',
  styleUrl: './layout-principal.component.scss'
})
export class LayoutPrincipalComponent implements OnInit {

  // Nossas variáveis
  public nomeUsuario: string = '';
  public roleUsuario: string = '';
  public iniciaisUsuario: string = '??';
  public sidebarVisible: boolean = false; // Controla o menu lateral

  // Injetando o Router
  private router = inject(Router);

  ngOnInit(): void {
    // 2. O Layout agora é quem lê os dados do usuário
    const userDataStorage = localStorage.getItem('userData');
    if (userDataStorage) {
      const userData = JSON.parse(userDataStorage);
      this.nomeUsuario = userData.nome;
      this.roleUsuario = userData.role; // Pega o ROLE (ADMIN/OPERADOR)
      this.iniciaisUsuario = this.getIniciais(userData.nome);
    } else {
      // Se entrar aqui sem estar logado, volta pro login
      this.router.navigate(['/login']);
    }
  }

  // 3. Função de Logout (movida da 'home' para cá)
  public logout(): void {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  // 4. Função auxiliar para pegar as iniciais do nome
  private getIniciais(nome: string): string {
    if (!nome) return '??';
    const nomes = nome.split(' ');
    const primeiraInicial = nomes[0][0];
    const ultimaInicial = nomes.length > 1 ? nomes[nomes.length - 1][0] : '';
    return (primeiraInicial + ultimaInicial).toUpperCase();
  }

  // 5. Função para exibir o menu (será chamada pelo botão no HTML)
  public toggleMenu(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
