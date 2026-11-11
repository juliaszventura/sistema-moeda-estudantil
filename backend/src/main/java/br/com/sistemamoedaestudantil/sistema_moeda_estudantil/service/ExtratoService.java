package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ExtratoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.TransacaoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.AlunoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ExtratoService {

    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;

    public ExtratoService(AlunoRepository alunoRepository, TransacaoRepository transacaoRepository) {
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Transactional(readOnly = true)
    public ExtratoResponse doAluno(UUID alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));
        List<TransacaoResponse> transacoes = transacaoRepository.extratoDe(alunoId).stream()
                .map(transacao -> TransacaoResponse.de(transacao, alunoId))
                .toList();
        return new ExtratoResponse(aluno.getId(), aluno.getNome(), aluno.getSaldoMoedas(), transacoes);
    }
}
