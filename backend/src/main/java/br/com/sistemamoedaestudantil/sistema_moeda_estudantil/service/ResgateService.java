package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ResgateRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ResgateResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento.ResgateRealizadoEvento;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Transacao;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Vantagem;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.AlunoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.TransacaoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.VantagemRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util.CodigoCupom;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ResgateService {

    private static final int TENTATIVAS_CODIGO = 5;

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoRepository transacaoRepository;
    private final ApplicationEventPublisher publicador;

    public ResgateService(AlunoRepository alunoRepository,
                          VantagemRepository vantagemRepository,
                          TransacaoRepository transacaoRepository,
                          ApplicationEventPublisher publicador) {
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.transacaoRepository = transacaoRepository;
        this.publicador = publicador;
    }

    @Transactional
    public ResgateResponse resgatar(UUID alunoId, ResgateRequest request) {
        if (request == null || request.vantagemId() == null) {
            throw new RequisicaoInvalidaException("Vantagem é obrigatória");
        }

        Aluno aluno = alunoRepository.buscarParaAtualizar(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));
        Vantagem vantagem = vantagemRepository.findById(request.vantagemId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada"));

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new RegraNegocioException("Saldo insuficiente: você tem " + aluno.getSaldoMoedas()
                    + " moedas e a vantagem custa " + vantagem.getCustoMoedas());
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        Transacao transacao = transacaoRepository.save(Transacao.resgate(aluno, vantagem, gerarCodigoUnico()));

        publicador.publishEvent(new ResgateRealizadoEvento(
                aluno.getNome(),
                aluno.getEmail(),
                vantagem.getNome(),
                vantagem.getEmpresa().getRazaoSocial(),
                vantagem.getEmpresa().getEmail(),
                vantagem.getCustoMoedas(),
                transacao.getCodigo()));

        return new ResgateResponse(
                transacao.getCodigo(),
                vantagem.getNome(),
                vantagem.getEmpresa().getRazaoSocial(),
                vantagem.getCustoMoedas(),
                aluno.getSaldoMoedas(),
                transacao.getDataHora());
    }

    private String gerarCodigoUnico() {
        for (int i = 0; i < TENTATIVAS_CODIGO; i++) {
            String codigo = CodigoCupom.gerar();
            if (!transacaoRepository.existsByCodigo(codigo)) {
                return codigo;
            }
        }
        throw new RegraNegocioException("Não foi possível gerar o código do cupom. Tente novamente");
    }
}
