package com.marc.javagentree.tree.repository;

import com.marc.javagentree.tree.model.NodeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface NodeRepository extends JpaRepository<NodeModel, Long> {

    @Query(
            value = "SELECT * FROM node n WHERE n.temporary_id is not null",
            nativeQuery = true
    )
    Collection<NodeModel> findAllNodesWithTemporaryId();
}
