package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RegraNegocioException;
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
 public int getSaldoMoedas(){return saldoMoedas;}

 /** Recebe moedas enviadas por um professor (chamado por Professor.distribuirMoedas). */
 void receberMoedas(int valor){saldoMoedas+=valor;}

 /**
  * Troca moedas por uma vantagem. O aluno conhece o próprio saldo, então é ele quem
  * confere se pode pagar e debita o custo (GRASP: Especialista na Informação).
  */
 public Transacao resgatar(Vantagem vantagem,String codigo){
  if(saldoMoedas<vantagem.getCustoMoedas()) throw new RegraNegocioException("Saldo insuficiente: você tem "+saldoMoedas+" moedas e a vantagem custa "+vantagem.getCustoMoedas());
  saldoMoedas-=vantagem.getCustoMoedas();
  return Transacao.resgate(this,vantagem,codigo);
 }
 @Override public String getNomeExibicao(){return nome;}
 @Override public Perfil getPerfil(){return Perfil.ALUNO;}
}