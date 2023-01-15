package com.marc.javagentree.login.business;

import com.marc.javagentree.login.model.Role;
import com.marc.javagentree.login.model.UserModel;

import java.util.List;

public interface UserService {
    UserModel registerUser(UserModel user);
    void loginUser(UserModel user);
    void logoutUser();
    void deleteUser(UserModel user);
    UserModel updateUser(UserModel user);
    UserModel getUser(String username);
    List<UserModel> getAllUsers();

    Role saveRole(Role role);
    void addRoleToUser(String usename, String roleName);
}
