import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Este é o nosso "Guarda" (Segurança) de rotas de Admin.
 * Ele será executado ANTES do Angular carregar a rota.
 */
export const adminGuard: CanActivateFn = (route, state) => {

  // 1. Injetamos o Router para podermos redirecionar o usuário
  const router = inject(Router);

  // 2. Buscamos os dados do usuário no localStorage
  const userDataStorage = localStorage.getItem('userData');

  if (userDataStorage) {
    try {
      const userData = JSON.parse(userDataStorage);

      // 3. A VERIFICAÇÃO PRINCIPAL:
      // O usuário logado tem o perfil (role) 'ADMIN'?
      if (userData.role === 'ADMIN') {
        return true; // SIM! Acesso permitido. Deixa carregar a rota.
      } else {
        // 4. Se for 'OPERADOR' (ou outro)
        console.warn('Acesso negado! Rota exclusiva para ADMINS.');
        // Envia o usuário para a página Home (que é segura)
        router.navigate(['/app/home']);
        return false; // BLOQUEIA a rota
      }
    } catch (e) {
      // 5. Se o localStorage estiver corrompido ou inválido
      console.error('Erro ao ler dados do usuário do localStorage', e);
      router.navigate(['/login']);
      return false; // BLOQUEIA a rota
    }
  }

  // 6. Se não achou NADA no localStorage (ninguém logado)
  console.log('Acesso negado. Usuário não logado.');
  router.navigate(['/login']);
  return false; // BLOQUEIA a rota
};
