package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ResgateRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ResgateResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.ResgateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/alunos/{alunoId}/resgates")
public class ResgateController {

    private final ResgateService service;

    public ResgateController(ResgateService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ResgateResponse> resgatar(@PathVariable UUID alunoId,
                                                    @RequestBody ResgateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.resgatar(alunoId, request));
    }
}
