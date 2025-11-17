package br.com.sigec.controller;

import br.com.sigec.model.Usuario;
import br.com.sigec.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

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
        // *** ALTERAÇÃO: Validação manual da senha na CRIAÇÃO ***
        if (novoUsuario.getSenha() == null || novoUsuario.getSenha().length() < 8) {
            throw new RuntimeException("A senha é obrigatória e deve ter no mínimo 8 caracteres.");
        }

        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
        return usuarioService.save(novoUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Usuario usuarioAtualizado
    ) {
        return usuarioService.findById(id)
                .map(usuarioExistente -> {
                    usuarioExistente.setNomeCompleto(usuarioAtualizado.getNomeCompleto());
                    usuarioExistente.setEmail(usuarioAtualizado.getEmail());
                    usuarioExistente.setPerfil(usuarioAtualizado.getPerfil());
                    usuarioExistente.setStatus(usuarioAtualizado.getStatus());

                    String novaSenha = usuarioAtualizado.getSenha();
                    if (novaSenha != null && !novaSenha.isEmpty()) {
                        usuarioExistente.setSenha(passwordEncoder.encode(novaSenha));
                    }

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


    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> trocarStatus(@PathVariable Long id) {
        usuarioService.trocarStatus(id);
        return ResponseEntity.noContent().build();
    }
}