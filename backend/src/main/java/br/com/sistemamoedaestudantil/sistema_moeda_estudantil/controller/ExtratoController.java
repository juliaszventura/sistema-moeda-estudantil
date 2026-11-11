package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ExtratoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.ExtratoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/alunos/{alunoId}/extrato")
public class ExtratoController {

    private final ExtratoService service;

    public ExtratoController(ExtratoService service) {
        this.service = service;
    }

    @GetMapping
    public ExtratoResponse extrato(@PathVariable UUID alunoId) {
        return service.doAluno(alunoId);
    }
}
