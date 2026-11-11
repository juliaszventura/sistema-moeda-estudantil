package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transacao")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 20, nullable = false)
    private TipoTransacao tipo;

    @Column(name = "valor", nullable = false)
    private int valor;

    @Column(name = "descricao", length = 500)
    private String descricao;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "origem_id", nullable = false)
    private Usuario origem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destino_id", nullable = false)
    private Usuario destino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vantagem_id")
    private Vantagem vantagem;

    @Column(name = "codigo", length = 9, unique = true)
    private String codigo;

    public static Transacao envio(Usuario professor, Aluno aluno, int valor, String motivo) {
        Transacao transacao = new Transacao();
        transacao.tipo = TipoTransacao.ENVIO;
        transacao.valor = valor;
        transacao.descricao = motivo;
        transacao.dataHora = LocalDateTime.now();
        transacao.origem = professor;
        transacao.destino = aluno;
        return transacao;
    }

    public static Transacao resgate(Aluno aluno, Vantagem vantagem, String codigo) {
        Transacao transacao = new Transacao();
        transacao.tipo = TipoTransacao.RESGATE;
        transacao.valor = vantagem.getCustoMoedas();
        transacao.descricao = "Resgate: " + vantagem.getNome();
        transacao.dataHora = LocalDateTime.now();
        transacao.origem = aluno;
        transacao.destino = vantagem.getEmpresa();
        transacao.vantagem = vantagem;
        transacao.codigo = codigo;
        return transacao;
    }

    public UUID getId() {
        return id;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public int getValor() {
        return valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public Usuario getOrigem() {
        return origem;
    }

    public Usuario getDestino() {
        return destino;
    }

    public Vantagem getVantagem() {
        return vantagem;
    }

    public String getCodigo() {
        return codigo;
    }
}
