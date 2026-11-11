package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.util.List;
import java.util.UUID;

public record ExtratoResponse(UUID usuarioId, String nome, int saldoMoedas, List<TransacaoResponse> transacoes) {
}
