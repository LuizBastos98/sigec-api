package br.com.sigec.service;

import br.com.sigec.dto.ItemVendaRequestDTO;
import br.com.sigec.dto.VendaRequestDTO;
import br.com.sigec.model.*;
import br.com.sigec.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification; // Import corrigido
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate; // Import necessário
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VendaService {

    // 1. AS INJEÇÕES (@Autowired) VÊM PRIMEIRO
    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    /**
     * Orquestra o registro completo de uma Venda.
     * Operação 100% transacional.
     */
    @Transactional
    public Venda registrarVenda(VendaRequestDTO dto) {


        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + dto.getUsuarioId()));


        Venda venda = new Venda();
        venda.setUsuarioResponsavel(usuario);
        venda.setDataHora(LocalDateTime.now());
        venda.setValorRecebido(dto.getValorRecebido());

        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ItemVenda> itensParaSalvar = new ArrayList<>();

        for (ItemVendaRequestDTO itemDTO : dto.getItens()) {


            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDTO.getProdutoId()));

            // 2b. REGRA: Valida o estoque
            if (produto.getQuantidadeEmEstoque() < itemDTO.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }


            BigDecimal subtotal = produto.getPrecoUnitario().multiply(new BigDecimal(itemDTO.getQuantidade()));
            valorTotal = valorTotal.add(subtotal);

            // 2d. Prepara o ItemVenda para salvar
            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemDTO.getQuantidade());
            itemVenda.setPrecoUnitarioSnapshot(produto.getPrecoUnitario());
            itemVenda.setSubtotal(subtotal);
            itemVenda.setVenda(venda); // Associa o item à venda
            itensParaSalvar.add(itemVenda);
        }

        // 3. Finaliza os cálculos da Venda (Total e Troco)
        venda.setValorTotal(valorTotal);


        BigDecimal troco = dto.getValorRecebido().subtract(valorTotal);
        if (troco.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Valor recebido é insuficiente para cobrir o total da venda.");
        }
        venda.setTroco(troco); //

        // 4. Salva a Venda e os Itens
        venda.setItens(itensParaSalvar);
        Venda vendaSalva = vendaRepository.save(venda);


        for (ItemVenda itemSalvo : vendaSalva.getItens()) {


            Produto produto = itemSalvo.getProduto();
            int novoEstoque = produto.getQuantidadeEmEstoque() - itemSalvo.getQuantidade();
            produto.setQuantidadeEmEstoque(novoEstoque);
            produtoRepository.save(produto);


            MovimentacaoEstoque historico = new MovimentacaoEstoque();
            historico.setProduto(produto);
            historico.setUsuarioResponsavel(usuario);
            historico.setDataHora(LocalDateTime.now());
            historico.setTipo(TipoMovimentacao.VENDA);
            historico.setQuantidade(itemSalvo.getQuantidade() * -1); // Quantidade negativa
            historico.setMotivo("Venda ID: " + vendaSalva.getId());
            movimentacaoEstoqueRepository.save(historico);
        }

        return vendaSalva;
    }


    /**
     * Busca vendas com base em filtros dinâmicos (para Relatórios).
     [cite_start]* [cite: 54-57]
     */
    @Transactional(readOnly = true)
    public List<Venda> findVendasByFiltro(LocalDate dataInicial, LocalDate dataFinal,
                                          BigDecimal valorMinimo, BigDecimal valorMaximo, Long usuarioId) {


        Specification<Venda> spec = Specification.where(null); // Começa uma query vazia


        if (dataInicial != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("dataHora"), dataInicial.atStartOfDay())
            );
        }

        if (dataFinal != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("dataHora"), dataFinal.atTime(23, 59, 59))
            );
        }

        if (valorMinimo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("valorTotal"), valorMinimo)
            );
        }

        if (valorMaximo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("valorTotal"), valorMaximo)
            );
        }

        if (usuarioId != null) {

            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("usuarioResponsavel").get("id"), usuarioId)
            );
        }


        return vendaRepository.findAll(spec);
    }

}