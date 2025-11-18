package br.com.sigec.controller;

import br.com.sigec.model.Produto;
import br.com.sigec.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * Lista produtos. Se passar ?somenteAtivos=true, filtra os inativos.
     */
    @GetMapping
    public List<Produto> listarTodos(@RequestParam(required = false, defaultValue = "false") Boolean somenteAtivos) {
        if (Boolean.TRUE.equals(somenteAtivos)) {
            return produtoService.listarApenasAtivos();
        }
        return produtoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Produto criar(@Valid @RequestBody Produto produto) {
        return produtoService.save(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @Valid @RequestBody Produto produto) {
        return produtoService.findById(id)
                .map(produtoExistente -> {
                    produto.setId(id);
                    return ResponseEntity.ok(produtoService.save(produto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            produtoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- NOVO ENDPOINT ---
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> trocarStatus(@PathVariable Long id) {
        produtoService.trocarStatus(id);
        return ResponseEntity.noContent().build();
    }
}