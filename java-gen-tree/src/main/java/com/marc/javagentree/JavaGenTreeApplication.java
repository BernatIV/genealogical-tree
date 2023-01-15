package com.marc.javagentree;

import com.marc.javagentree.login.business.UserService;
import com.marc.javagentree.login.model.Role;
import com.marc.javagentree.login.model.UserModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

@SpringBootApplication
public class JavaGenTreeApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaGenTreeApplication.class, args);
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CommandLineRunner run(UserService userService) {
		return args -> {
			// save roles and users
//			userService.saveRole(new Role(null, "ROLE_USER"));
//			userService.saveRole(new Role(null, "ROLE_MANAGER"));
//			userService.saveRole(new Role(null, "ROLE_ADMIN"));
//			userService.saveRole(new Role(null, "ROLE_SUPER_ADMIN"));
//
//			userService.registerUser(new UserModel(null, "john", "1234", new ArrayList<>()));
//			userService.registerUser(new UserModel(null, "will", "1234", new ArrayList<>()));
//			userService.registerUser(new UserModel(null, "jim", "1234", new ArrayList<>()));
//			userService.registerUser(new UserModel(null, "reed", "1234", new ArrayList<>()));
//			userService.registerUser(new UserModel(null, "arnold", "1234", new ArrayList<>()));
//
//			// add roles to users
//			userService.addRoleToUser("john", "ROLE_USER");
//			userService.addRoleToUser("john", "ROLE_MANAGER");
//			userService.addRoleToUser("will", "ROLE_MANAGER");
//			userService.addRoleToUser("jim", "ROLE_ADMIN");
//			userService.addRoleToUser("reed", "ROLE_SUPER_ADMIN");
//			userService.addRoleToUser("arnold", "ROLE_SUPER_ADMIN");
//			userService.addRoleToUser("arnold", "ROLE_ADMIN");
//			userService.addRoleToUser("arnold", "ROLE_USER");
		};
	}
}
