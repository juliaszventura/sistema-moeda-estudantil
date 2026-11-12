package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AuthRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AuthResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.NaoAutenticadoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Usuario;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.UsuarioRepository;
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
