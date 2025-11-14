package br.com.sigec.model;

/**
 * Define os tipos de movimentação de estoque.
 * ENTRADA: Reposição de estoque.
 * AJUSTE: Correção manual.
 * VENDA: Baixa automática gerada pelo módulo Caixa.
 */
public enum TipoMovimentacao {
    ENTRADA,
    AJUSTE,
    VENDA
}