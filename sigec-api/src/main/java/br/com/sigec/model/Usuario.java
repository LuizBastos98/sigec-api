package br.com.sigec.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidade que representa um Usuário no banco de dados.
 * Mapeia os campos definidos no módulo "Manter Usuários" [cite: 14-21].
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome completo é obrigatório")
    @Column(nullable = false, length = 150)
    private String nomeCompleto; // [cite: 17]

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido") //
    @Column(nullable = false, unique = true, length = 100) // [cite: 18, 25, 112]
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres") // [cite: 24, 112]
    @Column(nullable = false)
    private String senha; // [cite: 19]

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role perfil; // [cite: 20]

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusUsuario status; // [cite: 21]
}