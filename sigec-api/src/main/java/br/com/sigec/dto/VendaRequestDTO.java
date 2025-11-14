package br.com.sigec.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para receber a solicitação completa de registro de Venda.
 */
@Getter
@Setter
public class VendaRequestDTO {

    @NotNull
    private Long usuarioId;

    @NotNull
    @DecimalMin(value = "0.0", message = "Valor recebido não pode ser negativo")
    private BigDecimal valorRecebido;

    @Valid // Valida os itens da lista
    @NotEmpty(message = "A venda deve ter pelo menos um item")
    private List<ItemVendaRequestDTO> itens;
}