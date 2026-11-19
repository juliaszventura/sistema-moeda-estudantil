package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AlunoRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AlunoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Curso;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.InstituicaoEnsino;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.AlunoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.CursoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.UsuarioRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.validator.AlunoValidador;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository,
                        UsuarioRepository usuarioRepository,
                        CursoRepository cursoRepository,
                        PasswordEncoder passwordEncoder) {
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.cursoRepository = cursoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AlunoResponse> listar() {
        return alunoRepository.findAll().stream().map(this::resposta).toList();
    }

    @Transactional(readOnly = true)
    public AlunoResponse buscar(UUID id) {
        return resposta(buscarEntidade(id));
    }

    @Transactional
    public AlunoResponse cadastrar(AlunoRequest request) {
        AlunoValidador.validarCadastro(request);
        conferirUnicidade(request, null);
        Curso curso = buscarCurso(request);

        Aluno aluno = new Aluno();
        aluno.setLogin(request.login().trim());
        aluno.setSenhaHash(passwordEncoder.encode(request.senha()));
        preencher(aluno, request, curso);
        return resposta(alunoRepository.saveAndFlush(aluno));
    }

    @Transactional
    public AlunoResponse editar(UUID id, AlunoRequest request) {
        AlunoValidador.validarAtualizacao(request);
        Aluno aluno = buscarEntidade(id);
        conferirUnicidade(request, aluno);
        Curso curso = buscarCurso(request);

        aluno.setLogin(request.login().trim());
        if (request.senha() != null && !request.senha().isBlank()) {
            aluno.setSenhaHash(passwordEncoder.encode(request.senha()));
        }
        preencher(aluno, request, curso);
        return resposta(alunoRepository.saveAndFlush(aluno));
    }

    @Transactional
    public void excluir(UUID id) {
        alunoRepository.delete(buscarEntidade(id));
        alunoRepository.flush();
    }

    private Aluno buscarEntidade(UUID id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));
    }

    private Curso buscarCurso(AlunoRequest request) {
        Curso curso = cursoRepository.findById(request.cursoId())
                .orElseThrow(() -> new RequisicaoInvalidaException("Curso inválido"));
        if (!curso.getInstituicao().getId().equals(request.instituicaoId())) {
            throw new RequisicaoInvalidaException("Curso não pertence à instituição selecionada");
        }
        return curso;
    }

    /** Confere login, e-mail e CPF. Em edição, recebe o aluno atual para ignorar os próprios dados. */
    private void conferirUnicidade(AlunoRequest request, Aluno atual) {
        String login = request.login().trim();
        String email = request.email().trim().toLowerCase();
        String cpf = request.cpf().trim();

        boolean existeLogin;
        boolean existeEmail;
        boolean existeCpf;
        if (atual == null) {
            existeLogin = usuarioRepository.existsByLogin(login);
            existeEmail = alunoRepository.existsByEmail(email);
            existeCpf = alunoRepository.existsByCpf(cpf);
        } else {
            existeLogin = !atual.getLogin().equals(login) && usuarioRepository.existsByLogin(login);
            existeEmail = alunoRepository.existsByEmailAndIdNot(email, atual.getId());
            existeCpf = alunoRepository.existsByCpfAndIdNot(cpf, atual.getId());
        }
        if (existeLogin || existeEmail || existeCpf) {
            throw new RegraNegocioException("Login, e-mail ou CPF já cadastrado");
        }
    }

    private void preencher(Aluno aluno, AlunoRequest request, Curso curso) {
        aluno.setNome(request.nome().trim());
        aluno.setEmail(request.email().trim().toLowerCase());
        aluno.setCpf(request.cpf().trim());
        aluno.setRg(request.rg().trim());
        aluno.setEndereco(request.endereco().trim());
        aluno.setCurso(curso);
    }

    private AlunoResponse resposta(Aluno aluno) {
        Curso curso = aluno.getCurso();
        InstituicaoEnsino instituicao = curso.getInstituicao();
        return new AlunoResponse(aluno.getId(), aluno.getNome(), aluno.getEmail(), aluno.getCpf(),
                aluno.getRg(), aluno.getEndereco(), aluno.getLogin(),
                instituicao.getId(), instituicao.getNome(), curso.getId(), curso.getNome());
    }
}
