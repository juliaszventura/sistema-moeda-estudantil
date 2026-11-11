package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.VantagemRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.VantagemResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.VantagemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class VantagemController {

    private final VantagemService service;

    public VantagemController(VantagemService service) {
        this.service = service;
    }

    @PostMapping("/empresas-parceiras/{empresaId}/vantagens")
    public ResponseEntity<VantagemResponse> cadastrar(@PathVariable UUID empresaId,
                                                      @RequestBody VantagemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(empresaId, request));
    }

    @GetMapping("/empresas-parceiras/{empresaId}/vantagens")
    public List<VantagemResponse> listarPorEmpresa(@PathVariable UUID empresaId) {
        return service.listarPorEmpresa(empresaId);
    }

    @GetMapping("/vantagens")
    public List<VantagemResponse> listar() {
        return service.listar();
    }

    @PutMapping("/vantagens/{id}")
    public VantagemResponse atualizar(@PathVariable UUID id, @RequestBody VantagemRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/vantagens/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
