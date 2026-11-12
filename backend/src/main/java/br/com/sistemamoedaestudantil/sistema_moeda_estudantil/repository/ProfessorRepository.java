package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    @Override
    @EntityGraph(attributePaths = "instituicao")
    Optional<Professor> findById(UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Professor p where p.id = :id")
    Optional<Professor> buscarParaAtualizar(@Param("id") UUID id);
}
