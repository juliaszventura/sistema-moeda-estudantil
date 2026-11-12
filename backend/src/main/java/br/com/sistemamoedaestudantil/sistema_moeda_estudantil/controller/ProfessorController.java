package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EnvioMoedasRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EnvioMoedasResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ExtratoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.ProfessorResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.EnvioMoedasService;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/professores/{professorId}")
public class ProfessorController {

    private final ProfessorService professorService;
    private final EnvioMoedasService envioMoedasService;

    public ProfessorController(ProfessorService professorService, EnvioMoedasService envioMoedasService) {
        this.professorService = professorService;
        this.envioMoedasService = envioMoedasService;
    }

    @GetMapping
    public ProfessorResponse buscar(@PathVariable UUID professorId) {
        return professorService.buscar(professorId);
    }

    @GetMapping("/extrato")
    public ExtratoResponse extrato(@PathVariable UUID professorId) {
        return professorService.extrato(professorId);
    }

    @PostMapping("/envios")
    public ResponseEntity<EnvioMoedasResponse> enviar(@PathVariable UUID professorId,
                                                      @RequestBody EnvioMoedasRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(envioMoedasService.enviar(professorId, request));
    }
}
