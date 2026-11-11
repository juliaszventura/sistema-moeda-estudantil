package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;
import jakarta.persistence.*;
@Entity
@Table(name="aluno")
@PrimaryKeyJoinColumn(name="usuario_id")
public class Aluno extends Usuario {
 @Column(nullable=false,length=150) private String nome;
 @Column(nullable=false,unique=true,length=180) private String email;
 @Column(nullable=false,unique=true,length=11) private String cpf;
 @Column(nullable=false,length=30) private String rg;
 @Column(nullable=false,length=255) private String endereco;
 @Column(name="saldo_moedas",nullable=false,columnDefinition="int not null default 0") private int saldoMoedas;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="curso_id",nullable=false) private Curso curso;
 public String getNome(){return nome;} public void setNome(String v){nome=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getCpf(){return cpf;} public void setCpf(String v){cpf=v;}
 public String getRg(){return rg;} public void setRg(String v){rg=v;}
 public String getEndereco(){return endereco;} public void setEndereco(String v){endereco=v;}
 public Curso getCurso(){return curso;} public void setCurso(Curso v){curso=v;}
 public int getSaldoMoedas(){return saldoMoedas;} public void setSaldoMoedas(int v){saldoMoedas=v;}
 @Override public String getNomeExibicao(){return nome;}
}