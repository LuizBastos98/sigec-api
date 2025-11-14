package br.com.sigec.service;

import br.com.sigec.dto.MovimentacaoRequestDTO;
import br.com.sigec.model.MovimentacaoEstoque;
import br.com.sigec.model.Produto;
import br.com.sigec.model.TipoMovimentacao;
import br.com.sigec.model.Usuario;
import br.com.sigec.repository.MovimentacaoEstoqueRepository;
import br.com.sigec.repository.ProdutoRepository;
import br.com.sigec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MovimentacaoEstoqueService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    /**
     * Registra uma movimentação de estoque (Entrada ou Ajuste).
     * Esta operação é transacional: atualiza o produto E salva o histórico.
     */
    @Transactional
    public MovimentacaoEstoque registrarMovimentacao(MovimentacaoRequestDTO dto) {

        // 1. Validações de Negócio
        if (dto.getTipo() == TipoMovimentacao.VENDA) {
            throw new RuntimeException("Movimentações do tipo VENDA são feitas apenas pelo módulo Caixa.");
        }

        if (dto.getTipo() == TipoMovimentacao.AJUSTE && (dto.getMotivo() == null || dto.getMotivo().isBlank())) {
            throw new RuntimeException("Motivo é obrigatório para movimentações do tipo AJUSTE.");
        }

        // 2. Busca as entidades
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + dto.getProdutoId()));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + dto.getUsuarioId()));

        // 3. Calcula o novo estoque
        int novoEstoque = produto.getQuantidadeEmEstoque() + dto.getQuantidade();
        if (novoEstoque < 0) {
            // Regra do PDF: estoque >= 0
            throw new RuntimeException("Operação inválida. O estoque do produto não pode ficar negativo.");
        }

        // 4. Atualiza o produto
        produto.setQuantidadeEmEstoque(novoEstoque);
        produtoRepository.save(produto);

        // 5. Cria e salva o registro no histórico
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setProduto(produto);
        movimentacao.setUsuarioResponsavel(usuario);
        movimentacao.setDataHora(LocalDateTime.now());
        movimentacao.setTipo(dto.getTipo());
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setMotivo(dto.getMotivo());

        return movimentacaoEstoqueRepository.save(movimentacao);
    }
}