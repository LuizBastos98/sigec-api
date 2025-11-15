package br.com.sigec.service;

import br.com.sigec.dto.LoginRequestDTO;
import br.com.sigec.dto.LoginResponseDTO;
import br.com.sigec.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    // 1. INJETAR O NOSSO SERVIÇO DE TOKEN
    @Autowired
    private TokenService tokenService;

    public LoginResponseDTO login(LoginRequestDTO dto) throws AuthenticationException {

        // 2. Cria o "pacote" de autenticação (email/senha)
        UsernamePasswordAuthenticationToken usernamePassword =
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha());

        // 3. O Spring Security tenta autenticar
        Authentication auth = authenticationManager.authenticate(usernamePassword);

        // 4. Se chegou aqui, o login foi VÁLIDO.
        // Pegamos os dados do usuário que foi autenticado
        Usuario usuarioAutenticado = (Usuario) auth.getPrincipal();

        // 5. GERAMOS O TOKEN (O "CRACHÁ")
        String token = tokenService.generateToken(usuarioAutenticado);

        // 6. Retornamos o DTO de Resposta com o Token incluído
        return new LoginResponseDTO(
                usuarioAutenticado.getId(),
                usuarioAutenticado.getNomeCompleto(),
                usuarioAutenticado.getPerfil(),
                token // <-- O TOKEN VAI AQUI
        );
    }
}