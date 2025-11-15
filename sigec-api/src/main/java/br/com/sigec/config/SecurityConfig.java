package br.com.sigec.config;

import br.com.sigec.config.security.SecurityFilter;
import br.com.sigec.config.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/error").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()

                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                        .requestMatchers("/api/estoque/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/produtos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/vendas/registrar").hasRole("OPERADOR")

                        .requestMatchers(HttpMethod.GET, "/api/produtos").hasAnyRole("ADMIN", "OPERADOR")
                        .requestMatchers(HttpMethod.GET, "/api/produtos/**").hasAnyRole("ADMIN", "OPERADOR")
                        .requestMatchers(HttpMethod.GET, "/api/vendas").hasAnyRole("ADMIN", "OPERADOR")

                        .anyRequest().authenticated()
                )

                .headers(headers -> headers.frameOptions(options -> options.disable()));

        http.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        // REGISTRA O PROVIDER AQUI (ESSENCIAL!)
        http.authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
