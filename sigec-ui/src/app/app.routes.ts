import { Routes } from '@angular/router';

// Imports
import { LayoutPrincipalComponent } from './layout/layout-principal/layout-principal.component';
import { LoginComponent } from './telas/login/login.component';
import { HomeComponent } from './telas/home/home.component';
import { UsuariosComponent } from './telas/usuarios/usuarios.component';
import { UsuarioFormComponent } from './telas/usuario-form/usuario-form.component';
import { ProdutosComponent } from './telas/produtos/produtos.component';
import { ProdutoFormComponent } from './telas/produto-form/produto-form.component';
import { EstoqueFormComponent } from './telas/estoque-form/estoque-form.component';
import { CaixaComponent } from './telas/caixa/caixa.component';

// 1. IMPORTE O NOVO COMPONENTE DE RELATÓRIOS
import { RelatoriosComponent } from './telas/relatorios/relatorios.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: 'app',
    component: LayoutPrincipalComponent,
    children: [
      { path: 'home', component: HomeComponent },

      // Rotas de Usuários
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'usuarios/novo', component: UsuarioFormComponent },
      { path: 'usuarios/:id', component: UsuarioFormComponent },

      // Rotas de Estoque/Produto
      { path: 'estoque', component: ProdutosComponent },
      { path: 'estoque/novo', component: ProdutoFormComponent },
      { path: 'estoque/movimentar', component: EstoqueFormComponent },
      { path: 'estoque/:id', component: ProdutoFormComponent },

      // Rota do Operador (Caixa)
      { path: 'caixa', component: CaixaComponent },

      // 2. ADICIONE A ROTA DE RELATÓRIOS (ADMIN E OPERADOR)
      { path: 'relatorios', component: RelatoriosComponent },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
