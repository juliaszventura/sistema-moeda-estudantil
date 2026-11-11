package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento;

public record ResgateRealizadoEvento(
        String alunoNome,
        String alunoEmail,
        String vantagem,
        String empresaNome,
        String empresaEmail,
        int custoMoedas,
        String codigo) {
}
