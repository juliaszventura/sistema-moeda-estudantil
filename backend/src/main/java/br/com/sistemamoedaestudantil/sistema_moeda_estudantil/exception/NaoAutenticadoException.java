package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception;

public class NaoAutenticadoException extends RuntimeException {

    public NaoAutenticadoException(String mensagem) {
        super(mensagem);
    }
}
