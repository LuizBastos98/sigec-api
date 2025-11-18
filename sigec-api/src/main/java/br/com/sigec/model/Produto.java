package br.com.sigec.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
@Getter
@Setter
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Código do produto é obrigatório")
    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false, length = 200)
    private String nome;

    @Column(length = 100)
    private String categoria;

    @Min(value = 0, message = "Quantidade em estoque não pode ser negativa")
    @Column(nullable = false)
    private Integer quantidadeEmEstoque;

    @DecimalMin(value = "0.01", message = "Preço unitário deve ser maior que zero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;

    // --- CAMPO NOVO ---
    @Column(nullable = false)
    private Boolean ativo = true; // Nasce ativo por padrão
}