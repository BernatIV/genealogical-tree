package com.marc.javagentree.login.controller;

import com.marc.javagentree.login.business.UserService;
import com.marc.javagentree.login.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("register")
    public void registerUser(@RequestBody UserModel user) {
        userService.registerUser(user);
    }

    @PostMapping("login")
    public void loginUser(@RequestBody UserModel user) {
        userService.loginUser(user);
    }

}

/*
Spring Security LDAP
https://spring.io/guides/gs/authenticating-ldap/
 */