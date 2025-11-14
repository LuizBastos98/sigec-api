package br.com.sigec.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// 1. *** CORREÇÃO AQUI ***
// Adiciona os imports que estavam faltando
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa o cabeçalho de uma Venda (Caixa).
 */
@Entity
@Table(name = "vendas")
@Getter
@Setter
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    // 2. A mudança para EAGER (que vai corrigir o erro 500)
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ItemVenda> itens = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorRecebido;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal troco;

    // 3. A mudança para EAGER (que vai corrigir o erro 500)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuarioResponsavel;

    // Método utilitário
    public void adicionarItem(ItemVenda item) {
        itens.add(item);
        item.setVenda(this);
    }
}