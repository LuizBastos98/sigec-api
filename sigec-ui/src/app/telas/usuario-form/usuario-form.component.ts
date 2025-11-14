import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

// Services
import { UsuarioService } from '../../services/usuario.service';

// Módulos PrimeNG
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

const SENHA_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    ToolbarModule, ButtonModule, InputTextModule, PasswordModule,
    DropdownModule, InputSwitchModule, MessageModule, TooltipModule
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {

  // Nossas variáveis
  public usuarioForm: FormGroup;
  public perfis: any[] = [];
  public errorMessage: string | null = null;
  public isEditMode: boolean = false;
  private currentUserId: number | null = null;

  // Injeções
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.perfis = [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Operador', value: 'OPERADOR' }
    ];

    this.usuarioForm = this.fb.group({
      id: [null],
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.pattern(SENHA_REGEX)]],
      perfil: ['OPERADOR', [Validators.required]],
      status: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // --- MODO EDIÇÃO ---
      this.isEditMode = true;
      this.currentUserId = +idParam;

      this.usuarioForm.get('senha')?.setValidators([Validators.pattern(SENHA_REGEX)]);
      this.usuarioForm.get('senha')?.updateValueAndValidity();

      this.usuarioService.getUsuarioPorId(this.currentUserId).subscribe(
        (usuario) => {
          const statusBooleano = (usuario.status === 'ATIVO');

          this.usuarioForm.patchValue({
            ...usuario,
            status: statusBooleano,
            senha: ''
          });
        },
        (error) => {
          console.error('Erro ao buscar usuário:', error);
          this.errorMessage = "Usuário não encontrado.";
        }
      );
    }
  }

  public onSubmit(): void {
    this.errorMessage = null;
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.errorMessage = "Formulário inválido. Verifique os campos em vermelho.";
      return;
    }

    const dadosUsuario = this.usuarioForm.value;
    dadosUsuario.status = dadosUsuario.status ? 'ATIVO' : 'INATIVO';

    if (this.isEditMode && !dadosUsuario.senha) {
      delete dadosUsuario.senha;
    }

    const operacao = this.isEditMode
      ? this.usuarioService.atualizarUsuario(this.currentUserId!, dadosUsuario)
      : this.usuarioService.criarUsuario(dadosUsuario);

    operacao.subscribe(
      () => {
        console.log(`Usuário ${this.isEditMode ? 'atualizado' : 'criado'}!`);
        this.router.navigate(['/app/usuarios']);
      },
      (error) => {
        console.error('Erro ao salvar:', error);
        if (error.status === 400 || error.status === 409) {
          this.errorMessage = "Erro ao salvar: E-mail já cadastrado ou dados inválidos.";
        } else {
          this.errorMessage = "Erro inesperado ao salvar. Tente novamente.";
        }
      }
    );
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
