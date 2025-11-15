import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional (novo padrão do Angular)
 * Ele vai interceptar TODAS as requisições HTTP
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. Pegar o 'userData' (que tem o token) do localStorage
  const userDataStorage = localStorage.getItem('userData');

  if (userDataStorage) {
    // 2. Tentar extrair o token
    try {
      const userData = JSON.parse(userDataStorage);
      const token = userData.token; // O "crachá" JWT

      if (token) {
        // 3. Se achou o token, "clona" a requisição
        const clonedReq = req.clone({
          setHeaders: {
            // 4. Anexa o "crachá" no cabeçalho 'Authorization'
            Authorization: `Bearer ${token}`
          }
        });

        // 5. Envia a requisição "clonada" (agora com o crachá)
        return next(clonedReq);
      }
    } catch (e) {
      console.error("Erro ao ler o token do localStorage", e);
      // Deixa a requisição seguir sem token
    }
  }

  // Se não achou o token, deixa a requisição seguir (ela vai falhar no backend)
  return next(req);
};
