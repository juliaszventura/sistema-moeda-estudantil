package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Vantagem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VantagemRepository extends JpaRepository<Vantagem, UUID> {

    boolean existsByEmpresaIdAndNomeIgnoreCase(UUID empresaId, String nome);

    boolean existsByEmpresaIdAndNomeIgnoreCaseAndIdNot(UUID empresaId, String nome, UUID id);

    @EntityGraph(attributePaths = "empresa")
    List<Vantagem> findAllByOrderByNomeAsc();

    @EntityGraph(attributePaths = "empresa")
    List<Vantagem> findByEmpresaIdOrderByNomeAsc(UUID empresaId);

    @Override
    @EntityGraph(attributePaths = "empresa")
    Optional<Vantagem> findById(UUID id);
}
