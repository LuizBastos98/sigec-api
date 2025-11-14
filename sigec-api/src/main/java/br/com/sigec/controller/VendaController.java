package br.com.sigec.controller;

import br.com.sigec.dto.VendaRequestDTO;
import br.com.sigec.model.Venda;
import br.com.sigec.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller REST para Vendas (Caixa) e Relatórios.
 */
@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "http://localhost:4200")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    /**
     * Endpoint para REGISTRAR uma nova venda (Caixa).
     * HTTP POST /api/vendas/registrar
     */
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarVenda(@Valid @RequestBody VendaRequestDTO dto) {
        try {
            Venda vendaRegistrada = vendaService.registrarVenda(dto);

            // Cria um corpo de resposta simples e compatível com o Angular
            Map<String, Object> response = new HashMap<>();
            response.put("id", vendaRegistrada.getId());
            response.put("troco", vendaRegistrada.getTroco());
            response.put("status", "success");

            // Retorna 201 Created com JSON válido no corpo
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            // Retorna 400 Bad Request com mensagem de erro em texto
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para buscar o Relatório de Vendas com filtros.
     * HTTP GET /api/vendas
     * Exemplo: /api/vendas?usuarioId=1&dataInicial=2025-01-01
     */
    @GetMapping
    public ResponseEntity<List<Venda>> buscarVendasFiltradas(
            @RequestParam(required = false) LocalDate dataInicial,
            @RequestParam(required = false) LocalDate dataFinal,
            @RequestParam(required = false) BigDecimal valorMinimo,
            @RequestParam(required = false) BigDecimal valorMaximo,
            @RequestParam(required = false) Long usuarioId
    ) {
        List<Venda> vendas = vendaService.findVendasByFiltro(
                dataInicial, dataFinal, valorMinimo, valorMaximo, usuarioId
        );

        return ResponseEntity.ok(vendas);
    }
}
