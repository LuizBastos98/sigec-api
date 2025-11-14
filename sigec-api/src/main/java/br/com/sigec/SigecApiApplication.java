package br.com.sigec;

// Imports que vamos precisar
import br.com.sigec.config.SecurityConfig; // <-- IMPORTA NOSSA CONFIG
import br.com.sigec.model.Role;
import br.com.sigec.model.StatusUsuario;
import br.com.sigec.model.Usuario;
import br.com.sigec.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication

public class SigecApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SigecApiApplication.class, args);
    }

    /**
     * Roda na inicialização para popular o banco H2 com dados de teste.
     */
    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Cria o usuário Admin (se ele não existir)
            if (usuarioRepository.findByEmail("admin@sigec.com").isEmpty()) {
                System.out.println(">>> Criando usuário ADMIN de teste...");

                Usuario admin = new Usuario();
                admin.setNomeCompleto("Administrador Padrão");
                admin.setEmail("admin@sigec.com");
                admin.setSenha(passwordEncoder.encode("12345678"));
                admin.setPerfil(Role.ADMIN);
                admin.setStatus(StatusUsuario.ATIVO);

                usuarioRepository.save(admin);
                System.out.println(">>> Usuário ADMIN criado: admin@sigec.com | senha: 12345678");
            }
        };
    }

}