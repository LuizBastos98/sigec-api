import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

// --- MUDANÇA AQUI ---
// Importando os módulos visuais do PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-login',
  standalone: true,
  // --- MUDANÇA AQUI ---
  // Adicionando os módulos no array de imports
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent { // O resto da classe (lógica) continua IDÊNTICO

  loginError: string = '';
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.loginError = '';

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso!', response);
          localStorage.setItem('userData', JSON.stringify(response));
          this.router.navigate(['/app/home']);
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
          if (err.status === 401) {
            this.loginError = err.error;
          } else {
            this.loginError = 'Erro inesperado. Tente novamente mais tarde.';
          }
        }
      });
    } else {
      this.loginError = 'Por favor, preencha o e-mail e a senha.';
    }
  }
}
