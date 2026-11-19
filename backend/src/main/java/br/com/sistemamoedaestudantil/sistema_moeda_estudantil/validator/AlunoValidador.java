package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.validator;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AlunoRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util.Cpf;

import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

/**
 * Valida os dados de entrada do aluno antes das regras de negócio.
 * Classe criada para tirar essa responsabilidade do AlunoService
 * (GRASP: Invenção Pura e Alta Coesão), no mesmo formato do EmpresaParceiraValidador.
 */
public final class AlunoValidador {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private static final Pattern LOGIN = Pattern.compile("^[A-Za-z0-9._-]{3,50}$");

    private AlunoValidador() {
    }

    public static void validarCadastro(AlunoRequest request) {
        validarDados(request);
        if (vazio(request.senha())) {
            throw new RequisicaoInvalidaException("Senha é obrigatória");
        }
        validarSenha(request.senha());
    }

    public static void validarAtualizacao(AlunoRequest request) {
        validarDados(request);
        if (!vazio(request.senha())) {
            validarSenha(request.senha());
        }
    }

    private static void validarDados(AlunoRequest request) {
        if (request == null) {
            throw new RequisicaoInvalidaException("Dados do aluno são obrigatórios");
        }
        exigirTexto(request.nome(), "Nome é obrigatório", 150, "Nome deve ter no máximo 150 caracteres");
        if (vazio(request.email())) {
            throw new RequisicaoInvalidaException("Email é obrigatório");
        }
        String email = request.email().trim();
        if (email.length() > 180 || !EMAIL.matcher(email).matches()) {
            throw new RequisicaoInvalidaException("Email inválido");
        }
        if (vazio(request.cpf())) {
            throw new RequisicaoInvalidaException("CPF é obrigatório");
        }
        if (!Cpf.valido(request.cpf().trim())) {
            throw new RequisicaoInvalidaException("CPF inválido");
        }
        exigirTexto(request.rg(), "RG é obrigatório", 30, "RG deve ter no máximo 30 caracteres");
        exigirTexto(request.endereco(), "Endereço é obrigatório", 255, "Endereço deve ter no máximo 255 caracteres");
        if (vazio(request.login())) {
            throw new RequisicaoInvalidaException("Login é obrigatório");
        }
        if (!LOGIN.matcher(request.login().trim()).matches()) {
            throw new RequisicaoInvalidaException(
                    "Login deve ter de 3 a 50 caracteres: letras, números, ponto, hífen ou sublinhado");
        }
        if (request.instituicaoId() == null) {
            throw new RequisicaoInvalidaException("Instituição é obrigatória");
        }
        if (request.cursoId() == null) {
            throw new RequisicaoInvalidaException("Curso é obrigatório");
        }
    }

    private static void exigirTexto(String valor, String mensagemVazio, int maximo, String mensagemTamanho) {
        if (vazio(valor)) {
            throw new RequisicaoInvalidaException(mensagemVazio);
        }
        if (valor.trim().length() > maximo) {
            throw new RequisicaoInvalidaException(mensagemTamanho);
        }
    }

    private static void validarSenha(String senha) {
        if (senha.length() < 6 || senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new RequisicaoInvalidaException("Senha deve ter entre 6 e 72 caracteres");
        }
    }

    private static boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }
}
