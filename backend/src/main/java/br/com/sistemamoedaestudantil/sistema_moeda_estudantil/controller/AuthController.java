package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AlterarSenhaRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AuthRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.AuthResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return service.autenticar(request);
    }

    @PutMapping("/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarSenha(@RequestBody AlterarSenhaRequest request) {
        service.alterarSenha(request);
    }
}
