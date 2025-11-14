package br.com.sigec.controller;

import br.com.sigec.dto.MovimentacaoRequestDTO;
import br.com.sigec.model.MovimentacaoEstoque;
import br.com.sigec.service.MovimentacaoEstoqueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "http://localhost:4200")
public class MovimentacaoEstoqueController {

    @Autowired
    private MovimentacaoEstoqueService movimentacaoEstoqueService;

    /**
     * Endpoint para registrar uma movimentação de estoque (ENTRADA ou AJUSTE).
     * HTTP POST /api/estoque/movimentar
     */
    @PostMapping("/movimentar")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<MovimentacaoEstoque> registrarMovimentacao(@Valid @RequestBody MovimentacaoRequestDTO dto) {
        try {
            MovimentacaoEstoque movimentacao = movimentacaoEstoqueService.registrarMovimentacao(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(movimentacao);
        } catch (RuntimeException e) {
            // Retorna a mensagem de erro (Ex: "Produto não encontrado", "Estoque não pode ficar negativo")
            return ResponseEntity.badRequest().body(null);
        }
    }
}