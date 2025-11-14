package br.com.sigec.repository;

import br.com.sigec.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para a entidade MovimentacaoEstoque.
 */
@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    // Por enquanto, os métodos CRUD básicos (save, findAll, etc.) são suficientes.
}