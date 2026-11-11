package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Transacao;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TransacaoRepository extends JpaRepository<Transacao, UUID> {

    boolean existsByVantagemId(UUID vantagemId);

    boolean existsByCodigo(String codigo);

    @EntityGraph(attributePaths = {"origem", "destino", "vantagem"})
    @Query("select t from Transacao t where t.origem.id = :usuarioId or t.destino.id = :usuarioId order by t.dataHora desc")
    List<Transacao> extratoDe(@Param("usuarioId") UUID usuarioId);
}
