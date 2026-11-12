package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.evento;

public record EnvioMoedasEvento(String alunoNome, String alunoEmail, String professorNome, int valor, String motivo) {
}
