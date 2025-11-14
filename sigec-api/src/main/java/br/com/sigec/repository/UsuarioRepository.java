package br.com.sigec.repository;

import br.com.sigec.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para a entidade Usuario.
 * Estende JpaRepository para obter métodos CRUD prontos.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo e-mail.
     * Usado para validar duplicados  e para o login[cite: 100].
     * @param email O e-mail a ser buscado.
     * @return um Optional contendo o usuário, se encontrado.
     */
    Optional<Usuario> findByEmail(String email);

}