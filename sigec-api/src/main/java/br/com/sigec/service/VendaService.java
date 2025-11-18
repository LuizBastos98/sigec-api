package br.com.sigec.service;

import br.com.sigec.dto.ItemVendaRequestDTO;
import br.com.sigec.dto.VendaRequestDTO;
import br.com.sigec.model.ItemVenda;
import br.com.sigec.model.Produto;
import br.com.sigec.model.Usuario;
import br.com.sigec.model.Venda;
import br.com.sigec.repository.ProdutoRepository;
import br.com.sigec.repository.UsuarioRepository;
import br.com.sigec.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Venda registrarVenda(VendaRequestDTO dto) {
        // 1. Buscar usuário
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 2. Criar a Venda
        Venda venda = new Venda();
        venda.setDataHora(LocalDateTime.now());
        venda.setUsuarioResponsavel(usuario);
        venda.setValorRecebido(dto.getValorRecebido());

        BigDecimal totalVenda = BigDecimal.ZERO;

        // 3. Processar Itens
        for (ItemVendaRequestDTO itemDto : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDto.getProdutoId()));

            // *** VALIDAÇÃO NOVA ***
            if (!produto.getAtivo()) {
                throw new RuntimeException("Produto inativo não pode ser vendido: " + produto.getNome());
            }

            if (produto.getQuantidadeEmEstoque() < itemDto.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para: " + produto.getNome());
            }

            // Baixa no estoque
            produto.setQuantidadeEmEstoque(produto.getQuantidadeEmEstoque() - itemDto.getQuantidade());
            produtoRepository.save(produto);

            // Cria ItemVenda
            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setPrecoUnitarioSnapshot(produto.getPrecoUnitario());

            BigDecimal subtotal = produto.getPrecoUnitario().multiply(new BigDecimal(itemDto.getQuantidade()));
            item.setSubtotal(subtotal);

            venda.adicionarItem(item);
            totalVenda = totalVenda.add(subtotal);
        }

        // 4. Finalizar Valores
        venda.setValorTotal(totalVenda);

        if (venda.getValorRecebido().compareTo(totalVenda) < 0) {
            throw new RuntimeException("Valor recebido menor que o total da venda.");
        }

        venda.setTroco(venda.getValorRecebido().subtract(totalVenda));

        return vendaRepository.save(venda);
    }

    public List<Venda> findVendasByFiltro(LocalDate dataInicial, LocalDate dataFinal,
                                          BigDecimal valorMinimo, BigDecimal valorMaximo,
                                          Long usuarioId) {

        Specification<Venda> spec = Specification.where(null);

        if (dataInicial != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("dataHora"), dataInicial.atStartOfDay()));
        }

        if (dataFinal != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("dataHora"), dataFinal.atTime(LocalTime.MAX)));
        }

        if (valorMinimo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("valorTotal"), valorMinimo));
        }

        if (valorMaximo != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("valorTotal"), valorMaximo));
        }

        if (usuarioId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("usuarioResponsavel").get("id"), usuarioId));
        }

        return vendaRepository.findAll(spec);
    }
}