package br.com.sigec.service;

import br.com.sigec.model.Usuario;
import br.com.sigec.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder; // Injetando o BCrypt

    /**
     * Lista todos os usuários.
     */
    @Transactional(readOnly = true) // Boa prática para métodos de consulta
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
     * Implementa as regras de negócio.
     */
    @Transactional
    public Usuario save(Usuario usuario) {

        // 1. REGRA: Validar e-mail duplicado
        // (Estamos ignorando o ID do próprio usuário, caso seja uma atualização)
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
            // Lançar uma exceção específica seria o ideal, mas por enquanto vamos simples
            throw new RuntimeException("E-mail já cadastrado: " + usuario.getEmail());
        }

        // 2. REGRA: Criptografar a senha
        // (A política de 8 caracteres  é tratada pelo @Size na entidade)
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);

        // 3. Salva no banco
        return usuarioRepository.save(usuario);
    }

    /**
     * Exclui um usuário pelo ID.
     */
    @Transactional
    public void deleteById(Long id) {
        if (!usuarioRepository.existsById(id)) {
            // Lançar exceção de "não encontrado"
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}