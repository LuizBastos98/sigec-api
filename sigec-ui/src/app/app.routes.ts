import { Routes } from '@angular/router';

// Imports dos Componentes
import { LayoutPrincipalComponent } from './layout/layout-principal/layout-principal.component';
import { LoginComponent } from './telas/login/login.component';
import { HomeComponent } from './telas/home/home.component';
import { UsuariosComponent } from './telas/usuarios/usuarios.component';
import { UsuarioFormComponent } from './telas/usuario-form/usuario-form.component';
import { ProdutosComponent } from './telas/produtos/produtos.component';
import { ProdutoFormComponent } from './telas/produto-form/produto-form.component';
import { EstoqueFormComponent } from './telas/estoque-form/estoque-form.component';
import { CaixaComponent } from './telas/caixa/caixa.component';
import { RelatoriosComponent } from './telas/relatorios/relatorios.component';

// 1. IMPORTE O NOSSO "SEGURANÇA" (O GUARDA)
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: 'app',
    component: LayoutPrincipalComponent,
    children: [
      // --- Rotas Comuns (Admin e Operador) ---
      { path: 'home', component: HomeComponent },
      { path: 'relatorios', component: RelatoriosComponent },

      // --- Rota de Operador ---
      { path: 'caixa', component: CaixaComponent },
      // (No futuro, poderíamos criar um 'operadorGuard' para esta)

      // --- Rotas de ADMIN (PROTEGIDAS) ---
      // 2. "CONTRATE" O GUARDA em todas as rotas de Admin
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [adminGuard] // Protegida!
      },
      {
        path: 'usuarios/novo',
        component: UsuarioFormComponent,
        canActivate: [adminGuard] // Protegida!
      },
      {
        path: 'usuarios/:id',
        component: UsuarioFormComponent,
        canActivate: [adminGuard] // Protegida!
      },
      {
        path: 'estoque',
        component: ProdutosComponent,
        canActivate: [adminGuard] // Protegida!
      },
      {
        path: 'estoque/novo',
        component: ProdutoFormComponent,
        canActivate: [adminGuard] // Protegida!
      },
      {
        path: 'estoque/movimentar',
        component: EstoqueFormComponent,
        canActivate: [adminGuard] // Protegida!
      },
      {
        path: 'estoque/:id',
        component: ProdutoFormComponent,
        canActivate: [adminGuard] // Protegida!-cd
      },
    ]
  },

  // Rotas padrão
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Rota coringa
];
