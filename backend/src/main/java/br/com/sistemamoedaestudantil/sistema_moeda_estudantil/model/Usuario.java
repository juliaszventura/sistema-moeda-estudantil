package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private UUID id;

    @Column(name = "login", length = 80, nullable = false, unique = true)
    private String login;

    @Column(name = "senha_hash", length = 100, nullable = false)
    private String senhaHash;

    public UUID getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    /**
     * Cada subclasse informa o próprio perfil (GRASP: Polimorfismo), evitando
     * cadeias de instanceof em quem precisa saber o tipo do usuário.
     */
    public abstract Perfil getPerfil();

    /** Nome mostrado na tela e no extrato; cada perfil sabe qual é o seu. */
    public abstract String getNomeExibicao();
}
