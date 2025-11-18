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

// Imports dos Guardas
import { adminGuard } from './guards/admin.guard';
import { operatorGuard } from './guards/operator.guard'; // 1. IMPORTAR

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: 'app',
    component: LayoutPrincipalComponent,
    children: [
      // Rotas Comuns
      { path: 'home', component: HomeComponent },
      { path: 'relatorios', component: RelatoriosComponent },

      // --- Rota de Operador (PROTEGIDA) ---
      {
        path: 'caixa',
        component: CaixaComponent,
        canActivate: [operatorGuard] // 2. APLICAR O GUARDA AQUI
      },

      // --- Rotas de ADMIN (PROTEGIDAS) ---
      { path: 'usuarios', component: UsuariosComponent, canActivate: [adminGuard] },
      { path: 'usuarios/novo', component: UsuarioFormComponent, canActivate: [adminGuard] },
      { path: 'usuarios/:id', component: UsuarioFormComponent, canActivate: [adminGuard] },
      { path: 'estoque', component: ProdutosComponent, canActivate: [adminGuard] },
      { path: 'estoque/novo', component: ProdutoFormComponent, canActivate: [adminGuard] },
      { path: 'estoque/movimentar', component: EstoqueFormComponent, canActivate: [adminGuard] },
      { path: 'estoque/:id', component: ProdutoFormComponent, canActivate: [adminGuard] },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
