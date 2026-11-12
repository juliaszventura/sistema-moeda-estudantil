package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.time.LocalDateTime;

public record EnvioMoedasResponse(String aluno, int valor, int saldoRestante, LocalDateTime dataHora) {
}
