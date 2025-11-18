package br.com.sigec.service;

import br.com.sigec.model.Produto;
import br.com.sigec.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    // --- NOVO: Lista apenas os ativos ---
    @Transactional(readOnly = true)
    public List<Produto> listarApenasAtivos() {
        return produtoRepository.findByAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }

    @Transactional
    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado.");
        }
        produtoRepository.deleteById(id);
    }

    // --- NOVO: Troca o status ---
    @Transactional
    public void trocarStatus(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        produto.setAtivo(!produto.getAtivo()); // Inverte (true <-> false)
        produtoRepository.save(produto);
    }
}