package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EnvioMoedasRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EnvioMoedasResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento.EnvioMoedasEvento;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Transacao;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.AlunoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.ProfessorRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.TransacaoRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class EnvioMoedasService {

    private static final int VALOR_MAXIMO = 100_000;
    private static final int MOTIVO_MAXIMO = 500;

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    private final CreditoSemestralService creditoSemestralService;
    private final ApplicationEventPublisher publicador;

    public EnvioMoedasService(ProfessorRepository professorRepository,
                              AlunoRepository alunoRepository,
                              TransacaoRepository transacaoRepository,
                              CreditoSemestralService creditoSemestralService,
                              ApplicationEventPublisher publicador) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
        this.creditoSemestralService = creditoSemestralService;
        this.publicador = publicador;
    }

    @Transactional
    public EnvioMoedasResponse enviar(UUID professorId, EnvioMoedasRequest request) {
        validar(request);

        Professor professor = professorRepository.buscarParaAtualizar(professorId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));
        creditoSemestralService.aplicar(professor);
        Aluno aluno = alunoRepository.buscarParaAtualizar(request.alunoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));

        int valor = request.valor();
        if (professor.getSaldoMoedas() < valor) {
            throw new RegraNegocioException("Saldo insuficiente: você tem " + professor.getSaldoMoedas()
                    + " moedas e tentou enviar " + valor);
        }

        String motivo = request.motivo().trim();
        professor.setSaldoMoedas(professor.getSaldoMoedas() - valor);
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + valor);
        Transacao transacao = transacaoRepository.save(Transacao.envio(professor, aluno, valor, motivo));

        publicador.publishEvent(new EnvioMoedasEvento(
                aluno.getNome(), aluno.getEmail(), professor.getNome(), valor, motivo));

        return new EnvioMoedasResponse(aluno.getNome(), valor, professor.getSaldoMoedas(), transacao.getDataHora());
    }

    private void validar(EnvioMoedasRequest request) {
        if (request == null || request.alunoId() == null) {
            throw new RequisicaoInvalidaException("Selecione o aluno que vai receber as moedas");
        }
        if (request.valor() == null || request.valor() < 1 || request.valor() > VALOR_MAXIMO) {
            throw new RequisicaoInvalidaException("A quantidade deve estar entre 1 e " + VALOR_MAXIMO + " moedas");
        }
        String motivo = request.motivo() == null ? "" : request.motivo().trim();
        if (motivo.isEmpty() || motivo.length() > MOTIVO_MAXIMO) {
            throw new RequisicaoInvalidaException(
                    "Informe o motivo do reconhecimento (até " + MOTIVO_MAXIMO + " caracteres)");
        }
    }
}
