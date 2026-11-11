package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import java.util.UUID;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Vantagem;

public record VantagemResponse(
        UUID id,
        UUID empresaId,
        String empresaNome,
        String nome,
        String descricao,
        int custoMoedas,
        String foto) {

    public static VantagemResponse de(Vantagem vantagem) {
        return new VantagemResponse(
                vantagem.getId(),
                vantagem.getEmpresa().getId(),
                vantagem.getEmpresa().getRazaoSocial(),
                vantagem.getNome(),
                vantagem.getDescricao(),
                vantagem.getCustoMoedas(),
                vantagem.getFoto());
    }
}
