package com.marc.javagentree.login.business;

import com.marc.javagentree.login.model.UserModel;
import com.marc.javagentree.login.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void registerUser(UserModel user) {
        userRepository.save(user);
    }

    public void loginUser(UserModel user) {

    }

    public void logoutUser() {

    }

    public void deleteUser() {

    }

    public void updateUser() {

    }

    public void getUser() {

    }

    public void getAllUsers() {

    }

}
