package br.com.sigec.dto;

import br.com.sigec.model.TipoMovimentacao;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para receber uma solicitação de movimentação de estoque.
 */
@Getter
@Setter
public class MovimentacaoRequestDTO {

    @NotNull(message = "ID do Produto é obrigatório")
    private Long produtoId;

    @NotNull(message = "ID do Usuário é obrigatório")
    private Long usuarioId; // (Quando tivermos login, isso virá da sessão)

    @NotNull(message = "Tipo de movimentação é obrigatório")
    private TipoMovimentacao tipo; // ENTRADA ou AJUSTE

    @NotNull(message = "Quantidade é obrigatória")
    private Integer quantidade; // (Ex: +10 para entrada, -2 para ajuste)

    private String motivo; // (Obrigatório para AJUSTE)
}