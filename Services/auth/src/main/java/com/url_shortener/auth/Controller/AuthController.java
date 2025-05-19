package com.url_shortener.auth.Controller;

import com.url_shortener.auth.DTO.AuthRequest;
import com.url_shortener.auth.DTO.AuthResponse;
import com.url_shortener.auth.DTO.RegisterRequest;
import com.url_shortener.auth.Services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    // @PostMapping("/refresh-token")
    // public ResponseEntity<AuthResponse> refreshToken(@RequestBody String
    // refreshToken) {
    // return ResponseEntity.ok(authService.refreshToken(refreshToken));
    // }

    @GetMapping("/healthz")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth Service is running");
    }
}