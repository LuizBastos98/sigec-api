package br.com.sigec.service;

import br.com.sigec.model.Produto;
import br.com.sigec.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Camada de Serviço para as regras de negócio do Produto.
 * Implementa o CRUD e validações.
 */
@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    /**
     * Lista todos os produtos.
     */
    @Transactional(readOnly = true)
    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    /**
     * Busca um produto pelo ID.
     */
    @Transactional(readOnly = true)
    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }

    /**
     * Salva (cria ou atualiza) um produto.
     */
    @Transactional
    public Produto save(Produto produto) {

        // 1. REGRA: Validar código do produto duplicado
        Optional<Produto> produtoExistente = produtoRepository.findByCodigo(produto.getCodigo());
        if (produtoExistente.isPresent() && !produtoExistente.get().getId().equals(produto.getId())) {
            throw new RuntimeException("Código de produto já cadastrado: " + produto.getCodigo());
        }

        // 2. Salva no banco
        return produtoRepository.save(produto);
    }

    /**
     * Exclui um produto pelo ID.
     */
    @Transactional
    public void deleteById(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
        produtoRepository.deleteById(id);
    }
}