package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger LOG = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String remetente;

    public EmailService(ObjectProvider<JavaMailSender> mailSender,
                        @Value("${spring.mail.username:no-reply@moedaestudantil.local}") String remetente) {
        this.mailSender = mailSender;
        this.remetente = remetente;
    }

    public void enviar(String destinatario, String assunto, EmailModelo modelo) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            LOG.info("E-mail simulado (SMTP não configurado)\nPara: {}\nAssunto: {}\n{}", destinatario, assunto, modelo.texto());
            return;
        }
        try {
            MimeMessage mensagem = sender.createMimeMessage();
            MimeMessageHelper ajudante = new MimeMessageHelper(mensagem, true, "UTF-8");
            ajudante.setFrom(remetente);
            ajudante.setTo(destinatario);
            ajudante.setSubject(assunto);
            ajudante.setText(modelo.texto(), modelo.html());
            sender.send(mensagem);
        } catch (MailException | MessagingException e) {
            LOG.error("Falha ao enviar e-mail para {}: {}", destinatario, e.getMessage());
        }
    }

    public void enviar(String destinatario, String assunto, String texto) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            LOG.info("E-mail simulado (SMTP não configurado)\nPara: {}\nAssunto: {}\n{}", destinatario, assunto, texto);
            return;
        }
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setFrom(remetente);
            mensagem.setTo(destinatario);
            mensagem.setSubject(assunto);
            mensagem.setText(texto);
            sender.send(mensagem);
        } catch (MailException e) {
            LOG.error("Falha ao enviar e-mail para {}: {}", destinatario, e.getMessage());
        }
    }
}
