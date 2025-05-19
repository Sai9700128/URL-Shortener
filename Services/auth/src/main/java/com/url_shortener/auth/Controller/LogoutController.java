package com.url_shortener.auth.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LogoutController {

    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            // Log the logout event
            System.out.println("User logged out: " + authentication.getName());

            // Clear security context
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok("Logged out successfully");
        }
        return ResponseEntity.ok("No active session");
    }
}