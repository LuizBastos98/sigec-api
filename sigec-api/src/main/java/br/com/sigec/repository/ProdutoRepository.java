package br.com.sigec.repository;

import br.com.sigec.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // O Spring cria a query automaticamente pelo nome do método
    List<Produto> findByAtivoTrue();
}