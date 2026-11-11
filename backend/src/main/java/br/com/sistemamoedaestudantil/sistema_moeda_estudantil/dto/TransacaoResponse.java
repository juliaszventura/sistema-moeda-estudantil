package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Transacao;

public record TransacaoResponse(
        UUID id,
        String tipo,
        int valor,
        boolean credito,
        String descricao,
        String contraparte,
        String codigo,
        LocalDateTime dataHora) {

    public static TransacaoResponse de(Transacao transacao, UUID donoId) {
        boolean credito = transacao.getDestino().getId().equals(donoId);
        String contraparte = credito
                ? transacao.getOrigem().getNomeExibicao()
                : transacao.getDestino().getNomeExibicao();
        return new TransacaoResponse(
                transacao.getId(),
                transacao.getTipo().name(),
                transacao.getValor(),
                credito,
                transacao.getDescricao(),
                contraparte,
                transacao.getCodigo(),
                transacao.getDataHora());
    }
}
