package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento.EnvioMoedasEvento;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificacaoEnvioListener {

    private final EmailService emailService;

    public NotificacaoEnvioListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void aoEnviar(EnvioMoedasEvento evento) {
        emailService.enviar(
                evento.alunoEmail(),
                "Você recebeu " + evento.valor() + " moedas",
                "Olá, " + evento.alunoNome() + "!\n\n"
                        + "O professor " + evento.professorNome() + " reconheceu você com "
                        + evento.valor() + " moedas.\n\n"
                        + "Motivo: " + evento.motivo() + "\n\n"
                        + "Acesse o sistema para ver seu saldo e trocar por vantagens.");
    }
}
