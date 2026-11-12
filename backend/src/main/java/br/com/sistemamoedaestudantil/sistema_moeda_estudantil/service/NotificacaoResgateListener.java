package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento.ResgateRealizadoEvento;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificacaoResgateListener {

    private final EmailService emailService;

    public NotificacaoResgateListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void aoResgatar(ResgateRealizadoEvento evento) {
        emailService.enviar(
                evento.alunoEmail(),
                "Seu cupom: " + evento.vantagem(),
                EmailModelo.de(
                        "Seu cupom está pronto",
                        "Olá, " + evento.alunoNome() + "!",
                        List.of("Você resgatou \"" + evento.vantagem() + "\" de " + evento.empresaNome()
                                        + " por " + evento.custoMoedas() + " moedas.",
                                "Apresente o código abaixo na empresa parceira para concluir a troca presencial."))
                        .comDestaque("Código do cupom", evento.codigo()));
        emailService.enviar(
                evento.empresaEmail(),
                "Novo resgate: " + evento.vantagem(),
                EmailModelo.de(
                        "Novo resgate de vantagem",
                        "Olá, " + evento.empresaNome() + "!",
                        List.of("O aluno " + evento.alunoNome() + " resgatou \"" + evento.vantagem() + "\" por "
                                        + evento.custoMoedas() + " moedas.",
                                "Use o código abaixo para conferir o cupom quando o aluno for retirar a vantagem."))
                        .comDestaque("Código para conferência", evento.codigo()));
    }
}
