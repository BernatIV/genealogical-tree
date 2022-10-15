package com.marc.javagentree.tree.repository;

import com.marc.javagentree.tree.model.NodeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepository extends JpaRepository<NodeModel, Long> {
}
