package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Professor;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util.Semestre;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CreditoSemestralService {

    public static final int MOEDAS_POR_SEMESTRE = 1000;

    public void aplicar(Professor professor) {
        String atual = Semestre.atual(LocalDate.now());
        int semestres = Semestre.decorridos(professor.getUltimoSemestreCreditado(), atual);
        if (semestres > 0) {
            professor.setSaldoMoedas(professor.getSaldoMoedas() + semestres * MOEDAS_POR_SEMESTRE);
            professor.setUltimoSemestreCreditado(atual);
        }
    }
}
