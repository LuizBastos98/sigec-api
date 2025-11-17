package br.com.sigec.service;

import br.com.sigec.model.Usuario;
import br.com.sigec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Camada de Serviço para as regras de negócio do Usuário.
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // REMOVI O PASSWORD ENCODER DAQUI (O Controller já está fazendo isso)

    /**
     * Lista todos os usuários.
     */
    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    /**
     * Busca um usuário pelo ID.
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Salva (cria ou atualiza) um usuário.
     */
    @Transactional
    public Usuario save(Usuario usuario) {

        // 1. REGRA: Validar e-mail duplicado
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
            throw new RuntimeException("E-mail já cadastrado: " + usuario.getEmail());
        }

        // 2. REGRA DE CRIPTOGRAFIA FOI REMOVIDA DAQUI
        // O Controller já manda a senha criptografada.
        // Apenas salvamos o objeto como ele chegou.

        // 3. Salva no banco
        return usuarioRepository.save(usuario);
    }

    /**
     * Exclui um usuário pelo ID.
     */
    @Transactional
    public void deleteById(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}