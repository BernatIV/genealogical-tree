package com.marc.javagentree.login.model;

import javax.persistence.*;

@Entity
@Table(name = "USER")
public class UserModel {

    @Id
    @SequenceGenerator(
            name = "node_sequence",
            sequenceName = "node_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "node_sequence"
    )
    @Column(
            name = "id",
            updatable = false
    )
    private Long id;

    private String email;

    private String password;

    public UserModel() {
    }

    public UserModel(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
