package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util;

import java.security.SecureRandom;

public final class CodigoCupom {

    private static final String ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private CodigoCupom() {
    }

    public static String gerar() {
        StringBuilder codigo = new StringBuilder(9);
        for (int i = 0; i < 8; i++) {
            if (i == 4) {
                codigo.append('-');
            }
            codigo.append(ALFABETO.charAt(ALEATORIO.nextInt(ALFABETO.length())));
        }
        return codigo.toString();
    }
}
