package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.util.UUID;

public record EnvioMoedasRequest(UUID alunoId, Integer valor, String motivo) {
}
