package com.marc.javagentree.tree.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(
        name = "NODE",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "temporary_id_unique",
                        columnNames = "temporary_id")
        })
public class NodeModel {
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

    @Column(name = "node_type")
    private String nodeType;

    @Column(name = "person_name")
    private String personName;

    @Column(name = "job")
    private String job;

    @Column(name = "birth_place")
    private String birthPlace;

    @Column(name = "death_place")
    private String deathPlace;

    @Column(name = "birth_date")
    private Date birthDate;

    @Column(name = "death_date")
    private Date deathDate;

    @Column(name = "manual_input_date")
    private String manualInputDate;

    @Column(name = "position_x")
    private Double positionX;

    @Column(name = "position_y")
    private Double positionY;

    @Column(name = "temporary_id",
            unique = true)
    private String temporaryId;

    public NodeModel() {
    }

    public NodeModel(Long id, String nodeType, String personName, String job, String birthPlace, String deathPlace,
                     Date birthDate, Date deathDate, String manualInputDate, Double positionX, Double positionY,
                     String temporaryId) {
        this.id = id;
        this.nodeType = nodeType;
        this.personName = personName;
        this.job = job;
        this.birthPlace = birthPlace;
        this.deathPlace = deathPlace;
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.manualInputDate = manualInputDate;
        this.positionX = positionX;
        this.positionY = positionY;
        this.temporaryId = temporaryId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public String getDeathPlace() {
        return deathPlace;
    }

    public void setDeathPlace(String deathPlace) {
        this.deathPlace = deathPlace;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public Date getDeathDate() {
        return deathDate;
    }

    public void setDeathDate(Date deathDate) {
        this.deathDate = deathDate;
    }

    public String getManualInputDate() {
        return manualInputDate;
    }

    public void setManualInputDate(String manualInputDate) {
        this.manualInputDate = manualInputDate;
    }

    public Double getPositionX() {
        return positionX;
    }

    public void setPositionX(Double positionX) {
        this.positionX = positionX;
    }

    public Double getPositionY() {
        return positionY;
    }

    public void setPositionY(Double positionY) {
        this.positionY = positionY;
    }

    public String getTemporaryId() {
        return temporaryId;
    }

    public void setTemporaryId(String temporaryId) {
        this.temporaryId = temporaryId;
    }
}
