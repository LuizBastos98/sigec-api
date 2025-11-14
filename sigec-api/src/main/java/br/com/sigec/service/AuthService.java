package br.com.sigec.service;

import br.com.sigec.dto.LoginRequestDTO;
import br.com.sigec.dto.LoginResponseDTO;
import br.com.sigec.model.Usuario;
import br.com.sigec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. Injeta o "Gerenciador de Autenticação" do Spring
    @Autowired
    private AuthenticationManager authenticationManager;

    public LoginResponseDTO login(LoginRequestDTO dto) {

        // 2. O Spring Security agora faz a validação da senha para nós
        // (Ele usa o UserDetailsServiceImpl e o PasswordEncoder por baixo dos panos)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
        );

        // 3. Se chegou aqui, o login foi VÁLIDO.
        // O "authentication.getName()" retorna o e-mail que foi validado.
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Erro inesperado após autenticação"));

        // 4. Retorna os dados para o frontend
        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getPerfil()
        );
    }
}