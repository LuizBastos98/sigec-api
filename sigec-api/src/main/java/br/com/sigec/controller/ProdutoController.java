package br.com.sigec.controller;

import br.com.sigec.model.Produto;
import br.com.sigec.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

/**
 * Controller REST para o CRUD de Produtos.
 * Expõe os endpoints para o frontend.
 */
@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:4200")// Prefixo da URL
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * Endpoint para LISTAR todos os produtos.
     * HTTP GET /api/produtos
     */
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.findAll();
    }

    /**
     * Endpoint para BUSCAR um produto por ID.
     * HTTP GET /api/produtos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para CRIAR um novo produto.
     * HTTP POST /api/produtos
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Produto criar(@Valid @RequestBody Produto produto) {
        // @Valid ativa as validações do Model (@NotBlank, @Min, @DecimalMin)
        return produtoService.save(produto);
    }

    /**
     * Endpoint para ATUALIZAR um produto existente.
     * HTTP PUT /api/produtos/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @Valid @RequestBody Produto produto) {
        return produtoService.findById(id)
                .map(produtoExistente -> {
                    produto.setId(id); // Garante o ID correto
                    return ResponseEntity.ok(produtoService.save(produto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para EXCLUIR um produto.
     * HTTP DELETE /api/produtos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            produtoService.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}