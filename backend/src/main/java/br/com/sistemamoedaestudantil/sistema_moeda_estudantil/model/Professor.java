package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "professor")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Professor extends Usuario {

    @Column(name = "nome", length = 150, nullable = false)
    private String nome;

    @Column(name = "cpf", length = 11, nullable = false, unique = true)
    private String cpf;

    @Column(name = "departamento", length = 120, nullable = false)
    private String departamento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instituicao_id", nullable = false)
    private InstituicaoEnsino instituicao;

    @Column(name = "saldo_moedas", nullable = false)
    private int saldoMoedas;

    @Column(name = "ultimo_semestre_creditado", length = 6)
    private String ultimoSemestreCreditado;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public InstituicaoEnsino getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(InstituicaoEnsino instituicao) {
        this.instituicao = instituicao;
    }

    public int getSaldoMoedas() {
        return saldoMoedas;
    }

    public void setSaldoMoedas(int saldoMoedas) {
        this.saldoMoedas = saldoMoedas;
    }

    public String getUltimoSemestreCreditado() {
        return ultimoSemestreCreditado;
    }

    public void setUltimoSemestreCreditado(String ultimoSemestreCreditado) {
        this.ultimoSemestreCreditado = ultimoSemestreCreditado;
    }

    @Override
    public String getNomeExibicao() {
        return nome;
    }
}
