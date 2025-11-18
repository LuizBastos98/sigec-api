import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const operatorGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userDataStorage = localStorage.getItem('userData');

  if (userDataStorage) {
    try {
      const userData = JSON.parse(userDataStorage);

      // VERIFICAÇÃO: É Operador?
      if (userData.role === 'OPERADOR') {
        return true; // Acesso permitido
      } else {
        console.warn('Acesso negado! Rota exclusiva para OPERADORES.');
        router.navigate(['/app/home']); // Redireciona para Home
        return false;
      }
    } catch (e) {
      router.navigate(['/login']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};
