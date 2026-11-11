package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.validator;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.VantagemRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;

import java.util.Base64;
import java.util.List;

public final class VantagemValidador {

    private static final int CUSTO_MAXIMO = 100_000;
    private static final int FOTO_MAXIMA = 1_400_000;
    private static final List<String> PREFIXOS_FOTO = List.of(
            "data:image/png;base64,",
            "data:image/jpeg;base64,",
            "data:image/webp;base64,");

    private VantagemValidador() {
    }

    public static void validar(VantagemRequest request) {
        if (request == null) {
            throw new RequisicaoInvalidaException("Corpo da requisição inválido");
        }

        String nome = request.nome() == null ? "" : request.nome().trim();
        if (nome.length() < 3 || nome.length() > 120) {
            throw new RequisicaoInvalidaException("Nome da vantagem deve ter entre 3 e 120 caracteres");
        }

        String descricao = request.descricao() == null ? "" : request.descricao().trim();
        if (descricao.isEmpty() || descricao.length() > 500) {
            throw new RequisicaoInvalidaException("Descrição é obrigatória e deve ter até 500 caracteres");
        }

        Integer custo = request.custoMoedas();
        if (custo == null || custo < 1 || custo > CUSTO_MAXIMO) {
            throw new RequisicaoInvalidaException("Custo deve estar entre 1 e " + CUSTO_MAXIMO + " moedas");
        }

        validarFoto(request.foto());
    }

    private static void validarFoto(String foto) {
        if (foto == null || foto.isBlank()) {
            throw new RequisicaoInvalidaException("Foto do produto é obrigatória");
        }
        if (foto.length() > FOTO_MAXIMA) {
            throw new RequisicaoInvalidaException("Foto muito grande. Use uma imagem de até 1 MB");
        }
        String prefixo = PREFIXOS_FOTO.stream().filter(foto::startsWith).findFirst()
                .orElseThrow(() -> new RequisicaoInvalidaException("Foto deve ser PNG, JPEG ou WEBP"));
        try {
            Base64.getDecoder().decode(foto.substring(prefixo.length()));
        } catch (IllegalArgumentException e) {
            throw new RequisicaoInvalidaException("Foto inválida");
        }
    }
}
