package br.com.sigec.repository;

import br.com.sigec.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para a entidade Produto.
 */
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    /**
     * Busca um produto pelo seu código único.
     */
    Optional<Produto> findByCodigo(String codigo);
}