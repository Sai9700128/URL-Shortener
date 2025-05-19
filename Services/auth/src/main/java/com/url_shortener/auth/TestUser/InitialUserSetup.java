package com.url_shortener.auth.TestUser;

import com.url_shortener.auth.Model.Role;
import com.url_shortener.auth.Model.User;
import com.url_shortener.auth.Repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
@RequiredArgsConstructor
@Profile("dev") // Only run in development environment
public class InitialUserSetup {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createInitialUser() {
        return args -> {
            // Check if we already have users
            if (userRepo.count() == 0) {
                System.out.println("Creating initial test user...");

                // Create test user with USER role only
                User testUser = User.builder()
                        .username("testuser")
                        .email("test@example.com")
                        .password(passwordEncoder.encode("password123"))
                        .roles(Collections.singleton(Role.USER))
                        .enabled(true)
                        .build();

                userRepo.save(testUser);
                System.out.println("Initial test user created successfully.");
                System.out.println("Username: testuser");
                System.out.println("Password: password123");
            }
        };
    }
}
