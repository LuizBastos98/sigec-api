package br.com.sigec.service;

import br.com.sigec.model.StatusUsuario;
import br.com.sigec.model.Usuario;
import br.com.sigec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Esta classe diz ao Spring Security COMO encontrar um usuário no nosso banco.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Busca o usuário no nosso banco pelo e-mail
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));

        // 2. Verifica se o usuário está ativo
        if (usuario.getStatus() == StatusUsuario.INATIVO) {
            throw new UsernameNotFoundException("Usuário está inativo");
        }

        // 3. Converte nosso "Usuario" (do banco) para o "User" (do Spring Security)
        return new User(
                usuario.getEmail(),
                usuario.getSenha(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name()))
        );
    }
}