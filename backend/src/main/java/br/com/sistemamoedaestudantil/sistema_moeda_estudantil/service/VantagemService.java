package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.VantagemRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.VantagemResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RecursoNaoEncontradoException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Vantagem;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.EmpresaParceiraRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.TransacaoRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.VantagemRepository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.validator.VantagemValidador;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final TransacaoRepository transacaoRepository;

    public VantagemService(VantagemRepository vantagemRepository,
                           EmpresaParceiraRepository empresaRepository,
                           TransacaoRepository transacaoRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Transactional
    public VantagemResponse cadastrar(UUID empresaId, VantagemRequest request) {
        VantagemValidador.validar(request);
        EmpresaParceira empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa parceira não encontrada"));

        String nome = request.nome().trim();
        if (vantagemRepository.existsByEmpresaIdAndNomeIgnoreCase(empresaId, nome)) {
            throw new RegraNegocioException("Esta empresa já possui uma vantagem com esse nome");
        }

        Vantagem vantagem = new Vantagem();
        vantagem.setEmpresa(empresa);
        preencher(vantagem, request);
        return VantagemResponse.de(vantagemRepository.save(vantagem));
    }

    @Transactional(readOnly = true)
    public List<VantagemResponse> listar() {
        return vantagemRepository.findAllByOrderByNomeAsc().stream().map(VantagemResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<VantagemResponse> listarPorEmpresa(UUID empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new RecursoNaoEncontradoException("Empresa parceira não encontrada");
        }
        return vantagemRepository.findByEmpresaIdOrderByNomeAsc(empresaId).stream()
                .map(VantagemResponse::de)
                .toList();
    }

    @Transactional
    public VantagemResponse atualizar(UUID id, VantagemRequest request) {
        VantagemValidador.validar(request);
        Vantagem vantagem = buscarEntidade(id);

        String nome = request.nome().trim();
        if (vantagemRepository.existsByEmpresaIdAndNomeIgnoreCaseAndIdNot(vantagem.getEmpresa().getId(), nome, id)) {
            throw new RegraNegocioException("Esta empresa já possui uma vantagem com esse nome");
        }

        preencher(vantagem, request);
        return VantagemResponse.de(vantagemRepository.save(vantagem));
    }

    @Transactional
    public void excluir(UUID id) {
        Vantagem vantagem = buscarEntidade(id);
        if (transacaoRepository.existsByVantagemId(id)) {
            throw new RegraNegocioException("Vantagem já resgatada por algum aluno não pode ser excluída");
        }
        vantagemRepository.delete(vantagem);
    }

    private Vantagem buscarEntidade(UUID id) {
        return vantagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada"));
    }

    private void preencher(Vantagem vantagem, VantagemRequest request) {
        vantagem.setNome(request.nome().trim());
        vantagem.setDescricao(request.descricao().trim());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setFoto(request.foto());
    }
}
