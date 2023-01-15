package com.marc.javagentree.login.business;

import com.marc.javagentree.login.model.Role;
import com.marc.javagentree.login.model.UserModel;
import com.marc.javagentree.login.repository.RoleRepository;
import com.marc.javagentree.login.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // Authenticates the user
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            log.error("User not found in the database");
            throw new UsernameNotFoundException("User not found in the database");
        } else {
            log.info("User found in the database: {}", username);
        }

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return new User(user.getUsername(), user.getPassword(), authorities);
    }

    @Override
    public UserModel registerUser(UserModel user) {
        log.info("Registering user {}", user.getUsername());
        return userRepository.save(user);
    }

    @Override
    public void loginUser(UserModel user) {

    }

    @Override
    public void logoutUser() {

    }

    @Override
    public void deleteUser(UserModel user) {

    }

    @Override
    public UserModel updateUser(UserModel user) {
        return userRepository.save(user);
    }

    @Override
    public UserModel getUser(String username) {
        log.info("Fetching user {}", username);
        return userRepository.findByUsername(username);
    }

    @Override
    public List<UserModel> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving role {}", role.getName());

        return roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String usename, String roleName) {
        log.info("Adding role {} to user {}", roleName, usename);

        UserModel user = userRepository.findByUsername(usename);
        Role role = roleRepository.findByName(roleName);
        user.getRoles().add(role);
    }
}
