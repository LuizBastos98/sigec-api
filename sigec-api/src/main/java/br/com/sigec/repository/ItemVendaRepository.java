package br.com.sigec.repository;

import br.com.sigec.model.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para a entidade ItemVenda.
 */
@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
    // CRUD básico é suficiente.
}