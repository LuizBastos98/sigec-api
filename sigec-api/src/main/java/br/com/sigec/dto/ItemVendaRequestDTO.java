package br.com.sigec.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para representar um item sendo vendido na solicitação.
 */
@Getter
@Setter
public class ItemVendaRequestDTO {

    @NotNull
    private Long produtoId;

    @NotNull
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    private Integer quantidade;
}