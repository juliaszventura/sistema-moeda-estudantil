package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class TratadorDeExcecoes {

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<Map<String, String>> tratarRequisicaoInvalida(RequisicaoInvalidaException ex) {
        return resposta(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<Map<String, String>> tratarRegraNegocio(RegraNegocioException ex) {
        return resposta(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(NaoAutenticadoException.class)
    public ResponseEntity<Map<String, String>> tratarNaoAutenticado(NaoAutenticadoException ex) {
        return resposta(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, String>> tratarNaoEncontrado(RecursoNaoEncontradoException ex) {
        return resposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> tratarStatus(ResponseStatusException ex) {
        String mensagem = ex.getReason() != null ? ex.getReason() : "Erro ao processar a requisição";
        return resposta(ex.getStatusCode(), mensagem);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> tratarIdentificadorInvalido(MethodArgumentTypeMismatchException ex) {
        return resposta(HttpStatus.BAD_REQUEST, "Identificador inválido");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> tratarCorpoInvalido(HttpMessageNotReadableException ex) {
        return resposta(HttpStatus.BAD_REQUEST, "Corpo da requisição inválido");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarIntegridade(DataIntegrityViolationException ex) {
        return resposta(HttpStatus.CONFLICT, "Dados já cadastrados ou inválidos");
    }

    private ResponseEntity<Map<String, String>> resposta(HttpStatusCode status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}