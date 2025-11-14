package br.com.sigec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entidade que armazena o histórico de movimentações de estoque.
 * Cada registro representa uma alteração no saldo de um produto.
 */
@Entity
@Table(name = "movimentacoes_estoque")
@Getter
@Setter
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private LocalDateTime dataHora; //

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimentacao tipo; //

    // Quantidade que foi movimentada (ex: +10 para entrada, -2 para ajuste/venda)
    @Column(nullable = false)
    private Integer quantidade;

    // Motivo do ajuste ou referência (ex: "Correção de contagem" ou "Venda ID: 123")
    @Column(length = 255)
    private String motivo; //

    // Guarda qual usuário fez a movimentação
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuarioResponsavel;

}