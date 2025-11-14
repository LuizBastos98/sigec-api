package br.com.sigec.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Mantenha este import

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Entidade que representa um item dentro de uma Venda.
 */
@Entity
@Table(name = "itens_venda")
@Getter
@Setter
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O @JsonIgnore (para quebrar o loop)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venda_id", nullable = false)
    private Venda venda;

    // *** MUDANÇA AQUI ***
    // Força o Hibernate a buscar o produto JUNTOS com o ItemVenda
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitarioSnapshot;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}