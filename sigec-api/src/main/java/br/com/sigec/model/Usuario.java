package br.com.sigec.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome completo é obrigatório")
    @Column(nullable = false, length = 150)
    private String nomeCompleto;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role perfil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusUsuario status;

    // =========================
    // CONSTRUTORES
    // =========================
    public Usuario() {}

    // =========================
    // GETTERS/SETTERS
    // =========================
    public Long getId() { return id; }

    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Role getPerfil() { return perfil; }
    public void setPerfil(Role perfil) { this.perfil = perfil; }

    public StatusUsuario getStatus() { return status; }
    public void setStatus(StatusUsuario status) { this.status = status; }

    // =========================
    // MÉTODOS DO USERDETAILS
    // =========================
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    @Override
    public String getPassword() { return senha; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        return status == StatusUsuario.ATIVO;
    }
}
