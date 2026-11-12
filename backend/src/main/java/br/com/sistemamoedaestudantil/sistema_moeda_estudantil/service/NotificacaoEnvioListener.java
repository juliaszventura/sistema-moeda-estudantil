package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento.EnvioMoedasEvento;
import java.util.List;
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
                EmailModelo.de(
                        "Você recebeu " + evento.valor() + " moedas",
                        "Olá, " + evento.alunoNome() + "!",
                        List.of("O professor " + evento.professorNome() + " reconheceu você com " + evento.valor() + " moedas.",
                                "Motivo: " + evento.motivo(),
                                "Acesse o sistema para ver seu saldo e trocar suas moedas por vantagens.")));
    }
}
