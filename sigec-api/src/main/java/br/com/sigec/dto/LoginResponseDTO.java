package br.com.sigec.dto;

import br.com.sigec.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor // Cria um construtor com todos os campos
public class LoginResponseDTO {

    private Long id;
    private String nome;
    private Role role;
    // Futuramente, adicionaríamos um Token JWT aqui
}