package com.marc.javagentree.login.repository;

import com.marc.javagentree.login.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
