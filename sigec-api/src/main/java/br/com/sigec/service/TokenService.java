package br.com.sigec.service;

import br.com.sigec.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    @Value("${api.security.token.expiration}")
    private long expiration;

    /**
     * Gera Token JWT (JJWT 0.12.3)
     * Agora usa EMAIL como "subject" (ESSENCIAL!)
     */
    public String generateToken(Usuario usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("nome", usuario.getNomeCompleto());
        claims.put("role", usuario.getPerfil().name());

        Date now = new Date();
        Date validity = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(usuario.getEmail())  // <-- AQUI AGORA É EMAIL!
                .issuedAt(now)
                .expiration(validity)
                .and()
                .signWith(getKey())
                .compact();
    }

    /**
     * Valida token (JJWT 0.12.3)
     * Retorna o EMAIL armazenado no subject
     */
    public String validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject(); // <-- agora retorna o email

        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Chave secreta — não usa Base64.
     * Precisa ter pelo menos 32 chars.
     */
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
