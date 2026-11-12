package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.util.UUID;

public record AlterarSenhaRequest(UUID usuarioId, String senhaAtual, String novaSenha) {
}
