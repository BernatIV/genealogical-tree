package com.marc.javagentree.tree.repository;

import com.marc.javagentree.tree.model.EdgeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EdgeRepository extends JpaRepository<EdgeModel, Long> {
}
