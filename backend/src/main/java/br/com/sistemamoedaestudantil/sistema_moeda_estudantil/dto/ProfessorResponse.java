package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;

import java.util.UUID;

public record ProfessorResponse(UUID id, String nome, String departamento, String instituicao, int saldoMoedas) {

    public static ProfessorResponse de(Professor professor) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getDepartamento(),
                professor.getInstituicao().getNome(),
                professor.getSaldoMoedas());
    }
}
