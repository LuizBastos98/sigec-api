import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 1. Importe o 'withInterceptors'
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';

import { jwtInterceptor } from './interceptors/jwt.interceptor'; // 2. IMPORTE O NOSSO INTERCEPTOR

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 3. ATUALIZE ESTA LINHA
    // Diz ao Angular para usar o http com o nosso interceptor
    provideHttpClient(withInterceptors([jwtInterceptor])),

    provideAnimations(),
    ConfirmationService,
    MessageService
  ]
};
