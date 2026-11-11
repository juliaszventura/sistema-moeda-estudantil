package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento.ResgateRealizadoEvento;
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
                "Olá, " + evento.alunoNome() + "!\n\n"
                        + "Você resgatou \"" + evento.vantagem() + "\" de " + evento.empresaNome()
                        + " por " + evento.custoMoedas() + " moedas.\n\n"
                        + "Código do cupom: " + evento.codigo() + "\n\n"
                        + "Apresente este código na empresa parceira para concluir a troca presencial.");
        emailService.enviar(
                evento.empresaEmail(),
                "Novo resgate: " + evento.vantagem(),
                "O aluno " + evento.alunoNome() + " resgatou \"" + evento.vantagem() + "\" por "
                        + evento.custoMoedas() + " moedas.\n\n"
                        + "Código para conferência: " + evento.codigo());
    }
}
