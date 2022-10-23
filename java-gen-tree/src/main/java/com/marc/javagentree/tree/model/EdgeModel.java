package com.marc.javagentree.tree.model;

import javax.persistence.*;

@Entity
@Table(name = "EDGE")
public class EdgeModel {
    @Id
    @SequenceGenerator(
            name = "edge_sequence",
            sequenceName = "edge_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "edge_sequence"
    )
    @Column(
            name = "id",
            updatable = false
    )
    private Long id;

    @Column(name = "source")
    private String source;

    @Column(name = "source_handle")
    private String sourceHandle;

    @Column(name = "target")
    private String target;

    @Column(name = "target_handle")
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
