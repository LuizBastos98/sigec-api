package br.com.sigec.controller;

import br.com.sigec.model.Usuario;
import br.com.sigec.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// 1. IMPORTAR O PASSWORD ENCODER
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
// 2. REMOVA O @CrossOrigin DAQUI
// (O seu SecurityConfig.java com o 'corsConfigurationSource()' já cuida disso!)
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // 3. INJETAR O ENCODER
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario criar(@Valid @RequestBody Usuario novoUsuario) {
        // (Nota: Idealmente, o 'save' no service deveria criptografar a senha)
        // Mas vamos garantir aqui, caso o service não o faça.
        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
        return usuarioService.save(novoUsuario);
    }

    /**
     * Endpoint para ATUALIZAR um usuário (AGORA 100% CORRETO E SEGURO)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Usuario usuarioAtualizado
    ) {
        return usuarioService.findById(id)
                .map(usuarioExistente -> {

                    // --- 4. A LÓGICA DE CÓPIA (O JEITO CERTO) ---

                    // Copia os campos do DTO (usuarioAtualizado) para a Entidade (usuarioExistente)
                    usuarioExistente.setNomeCompleto(usuarioAtualizado.getNomeCompleto());
                    usuarioExistente.setEmail(usuarioAtualizado.getEmail());
                    usuarioExistente.setPerfil(usuarioAtualizado.getPerfil());
                    usuarioExistente.setStatus(usuarioAtualizado.getStatus());

                    // Só atualiza a senha SE o usuário digitou uma nova
                    // (O frontend envia "" ou null se a senha não for mudada)
                    String novaSenha = usuarioAtualizado.getSenha();
                    if (novaSenha != null && !novaSenha.isEmpty()) {
                        usuarioExistente.setSenha(passwordEncoder.encode(novaSenha));
                    }

                    // Salva a ENTIDADE EXISTENTE (com a senha criptografada)
                    return ResponseEntity.ok(usuarioService.save(usuarioExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}