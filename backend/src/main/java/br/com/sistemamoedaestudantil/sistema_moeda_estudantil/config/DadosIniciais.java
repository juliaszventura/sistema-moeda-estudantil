package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.config;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.InstituicaoEnsino;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.InstituicaoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.ProfessorRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DadosIniciais implements CommandLineRunner {

    private static final Logger LOG = LoggerFactory.getLogger(DadosIniciais.class);
    private static final String SENHA_PADRAO = "professor123";

    private record Semente(String login, String nome, String cpf, String departamento) {
    }

    private static final List<Semente> PROFESSORES = List.of(
            new Semente("prof.ana", "Ana Beatriz Lima", "12345678062", "Engenharia de Software"),
            new Semente("prof.carlos", "Carlos Eduardo Rocha", "23456789173", "Ciência da Computação"),
            new Semente("prof.marina", "Marina Souza Alves", "34567890256", "Sistemas de Informação"));

    private final ProfessorRepository professorRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DadosIniciais(ProfessorRepository professorRepository,
                         InstituicaoRepository instituicaoRepository,
                         UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (professorRepository.count() > 0) {
            return;
        }
        List<InstituicaoEnsino> instituicoes = instituicaoRepository.findAllByOrderByNome();
        if (instituicoes.isEmpty()) {
            LOG.warn("Nenhuma instituição de ensino cadastrada: os professores iniciais não foram criados.");
            return;
        }
        InstituicaoEnsino instituicao = instituicoes.get(0);
        for (Semente semente : PROFESSORES) {
            if (usuarioRepository.existsByLogin(semente.login())) {
                continue;
            }
            Professor professor = new Professor();
            professor.setLogin(semente.login());
            professor.setSenhaHash(passwordEncoder.encode(SENHA_PADRAO));
            professor.setNome(semente.nome());
            professor.setCpf(semente.cpf());
            professor.setDepartamento(semente.departamento());
            professor.setInstituicao(instituicao);
            professorRepository.save(professor);
        }
        LOG.info("Professores iniciais criados (senha padrão: {}).", SENHA_PADRAO);
    }
}
