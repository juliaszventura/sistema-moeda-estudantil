package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.time.LocalDateTime;

public record ResgateResponse(
        String codigo,
        String vantagem,
        String empresa,
        int custoMoedas,
        int saldoRestante,
        LocalDateTime dataHora) {
}
