package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AlterarSenhaRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AuthRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AuthResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.NaoAutenticadoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Usuario;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final String MENSAGEM_INVALIDO = "Login ou senha inválidos";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CreditoSemestralService creditoSemestralService;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       CreditoSemestralService creditoSemestralService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.creditoSemestralService = creditoSemestralService;
    }

    @Transactional
    public AuthResponse autenticar(AuthRequest request) {
        if (request == null || request.login() == null || request.login().isBlank()
                || request.senha() == null || request.senha().isEmpty()) {
            throw new RequisicaoInvalidaException("Informe login e senha");
        }

        Usuario usuario = usuarioRepository.findByLogin(request.login().trim())
                .orElseThrow(() -> new NaoAutenticadoException(MENSAGEM_INVALIDO));
        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new NaoAutenticadoException(MENSAGEM_INVALIDO);
        }

        if (usuario instanceof Professor professor) {
            creditoSemestralService.aplicar(professor);
        }
        return new AuthResponse(usuario.getId(), perfilDe(usuario), usuario.getNomeExibicao());
    }

    @Transactional
    public void alterarSenha(AlterarSenhaRequest request) {
        if (request == null || request.usuarioId() == null) {
            throw new RequisicaoInvalidaException("Usuário não informado");
        }
        if (request.senhaAtual() == null || request.senhaAtual().isEmpty()) {
            throw new RequisicaoInvalidaException("Informe a senha atual");
        }
        String nova = request.novaSenha();
        if (nova == null || nova.length() < 6 || nova.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new RequisicaoInvalidaException("A nova senha deve ter entre 6 e 72 caracteres");
        }

        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenhaHash())) {
            throw new NaoAutenticadoException("Senha atual incorreta");
        }
        usuario.setSenhaHash(passwordEncoder.encode(nova));
    }

    private String perfilDe(Usuario usuario) {
        if (usuario instanceof Aluno) {
            return "ALUNO";
        }
        if (usuario instanceof Professor) {
            return "PROFESSOR";
        }
        if (usuario instanceof EmpresaParceira) {
            return "EMPRESA";
        }
        throw new NaoAutenticadoException(MENSAGEM_INVALIDO);
    }
}
