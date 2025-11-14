package br.com.sigec.controller;

import br.com.sigec.model.Usuario;
import br.com.sigec.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para o CRUD de Usuários.
 * Expõe os endpoints para o frontend.
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")// Prefixo da URL para todos os métodos
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Endpoint para LISTAR todos os usuários.
     * HTTP GET /api/usuarios
     */
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.findAll();
    }

    /**
     * Endpoint para BUSCAR um usuário por ID.
     * HTTP GET /api/usuarios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok) // Se encontrar, retorna 200 OK com o usuário
                .orElse(ResponseEntity.notFound().build()); // Se não, retorna 404 Not Found
    }

    /**
     * Endpoint para CRIAR um novo usuário.
     * HTTP POST /api/usuarios
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // Retorna 201 Created
    public Usuario criar(@Valid @RequestBody Usuario usuario) {
        // @Valid: Ativa as validações que colocamos no Model (@NotBlank, @Email, etc.)
        return usuarioService.save(usuario);
    }

    /**
     * Endpoint para ATUALIZAR um usuário existente.
     * HTTP PUT /api/usuarios/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
        return usuarioService.findById(id)
                .map(usuarioExistente -> {
                    usuario.setId(id); // Garante que estamos atualizando o ID correto
                    return ResponseEntity.ok(usuarioService.save(usuario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para EXCLUIR um usuário.
     * HTTP DELETE /api/usuarios/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            usuarioService.deleteById(id);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content
        } catch (RuntimeException e) {
            // Captura a exceção que criamos no Service se o usuário não for encontrado
            return ResponseEntity.notFound().build();
        }
    }
}