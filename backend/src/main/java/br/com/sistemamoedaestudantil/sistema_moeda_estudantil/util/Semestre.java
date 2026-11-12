package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util;

import java.time.LocalDate;

public final class Semestre {

    private Semestre() {
    }

    public static String atual(LocalDate data) {
        return data.getYear() + "-" + (data.getMonthValue() <= 6 ? 1 : 2);
    }

    public static int decorridos(String ultimo, String atual) {
        if (ultimo == null) {
            return 1;
        }
        return Math.max(0, indice(atual) - indice(ultimo));
    }

    private static int indice(String semestre) {
        String[] partes = semestre.split("-");
        return Integer.parseInt(partes[0]) * 2 + Integer.parseInt(partes[1]);
    }
}
