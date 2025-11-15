package br.com.sigec.dto;

import br.com.sigec.model.Role;
import lombok.Getter;

@Getter
// Removi o @AllArgsConstructor para podermos ter um construtor personalizado
public class LoginResponseDTO {

    private Long id;
    private String nome;
    private Role role;
    private String token; // 1. CAMPO ADICIONADO

    /**
     * Construtor que recebe o Token
     */
    public LoginResponseDTO(Long id, String nome, Role role, String token) {
        this.id = id;
        this.nome = nome;
        this.role = role;
        this.token = token; // 2. TOKEN INCLUÍDO
    }
}