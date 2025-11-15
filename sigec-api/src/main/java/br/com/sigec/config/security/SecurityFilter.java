package br.com.sigec.config.security;

import br.com.sigec.model.Usuario;
import br.com.sigec.repository.UsuarioRepository;
import br.com.sigec.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/registro",
            "/h2-console"
    );

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return PUBLIC_ENDPOINTS.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = recuperarToken(request);

        if (token != null) {

            String email = tokenService.validateToken(token);

            if (email != null && !email.isEmpty()) {

                Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

                if (usuario != null) {

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    usuario,
                                    null,
                                    usuario.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return null;
    }
}
