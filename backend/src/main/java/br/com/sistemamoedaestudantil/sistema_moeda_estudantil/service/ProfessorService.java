package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ExtratoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ProfessorResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.TransacaoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.ProfessorRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final TransacaoRepository transacaoRepository;
    private final CreditoSemestralService creditoSemestralService;

    public ProfessorService(ProfessorRepository professorRepository,
                            TransacaoRepository transacaoRepository,
                            CreditoSemestralService creditoSemestralService) {
        this.professorRepository = professorRepository;
        this.transacaoRepository = transacaoRepository;
        this.creditoSemestralService = creditoSemestralService;
    }

    @Transactional
    public ProfessorResponse buscar(UUID id) {
        Professor professor = buscarEntidade(id);
        creditoSemestralService.aplicar(professor);
        return ProfessorResponse.de(professor);
    }

    @Transactional
    public ExtratoResponse extrato(UUID id) {
        Professor professor = buscarEntidade(id);
        creditoSemestralService.aplicar(professor);
        List<TransacaoResponse> transacoes = transacaoRepository.extratoDe(id).stream()
                .map(transacao -> TransacaoResponse.de(transacao, id))
                .toList();
        return new ExtratoResponse(professor.getId(), professor.getNome(), professor.getSaldoMoedas(), transacoes);
    }

    private Professor buscarEntidade(UUID id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));
    }
}
