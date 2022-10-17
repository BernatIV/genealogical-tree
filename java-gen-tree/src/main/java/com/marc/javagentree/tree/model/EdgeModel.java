package com.marc.javagentree.tree.model;

import javax.persistence.*;

@Entity
@Table(name = "EDGE")
public class EdgeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String source;
    private String sourceHandle;
    private String target;
    private String targetHandle;

    public EdgeModel() {

    }

    public EdgeModel(Long id, String source, String target, String sourceHandle, String targetHandle) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.sourceHandle = sourceHandle;
        this.targetHandle = targetHandle;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getSourceHandle() {
        return sourceHandle;
    }

    public void setSourceHandle(String sourceHandle) {
        this.sourceHandle = sourceHandle;
    }

    public String getTargetHandle() {
        return targetHandle;
    }

    public void setTargetHandle(String targetHandle) {
        this.targetHandle = targetHandle;
    }
}
