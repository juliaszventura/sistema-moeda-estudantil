package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.util.UUID;

public record AuthResponse(UUID id, String perfil, String nome) {
}
