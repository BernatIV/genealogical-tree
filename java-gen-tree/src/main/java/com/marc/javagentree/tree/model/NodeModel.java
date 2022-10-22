package com.marc.javagentree.tree.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "NODE")
public class NodeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nodeType;
    private String personName;
    private String job;
    private String birthPlace;
    private String deathPlace;
    private Date birthDate;
    private Date deathDate;
    private String manualInputDate;
    private Double positionX;
    private Double positionY;
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
