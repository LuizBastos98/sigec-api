package br.com.sigec.repository;

import br.com.sigec.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // 1. IMPORTE ISSO
import org.springframework.stereotype.Repository;

/**
 * Repositório para a entidade Venda.
 */
@Repository
public interface VendaRepository extends JpaRepository<Venda, Long>,
        JpaSpecificationExecutor<Venda> { // 2. ADICIONE ISSO

    // Não precisamos de mais nada. O JpaSpecificationExecutor nos dará o método
    // findAll(Specification) que usaremos.
}