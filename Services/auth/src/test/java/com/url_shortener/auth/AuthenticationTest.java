package com.url_shortener.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.url_shortener.auth.DTO.AuthRequest;
import com.url_shortener.auth.DTO.AuthResponse;
import com.url_shortener.auth.DTO.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private final String testUsername = "authuser";
    private final String testEmail = "auth@example.com";
    private final String testPassword = "password123";

    @BeforeEach
    public void setup() throws Exception {
        // Create a test user for authentication tests
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username(testUsername)
                .email(testEmail)
                .password(testPassword)
                .build();

        // Register the user (ignore if already exists)
        try {
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest)));
        } catch (Exception e) {
            // User might already exist, which is fine
        }
    }

    @Test
    public void testSuccessfulAuthentication() throws Exception {
        // Create login request
        AuthRequest authRequest = AuthRequest.builder()
                .username(testUsername)
                .password(testPassword)
                .build();

        // Perform login
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(testUsername))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
    }

    @Test
    public void testFailedAuthentication() throws Exception {
        // Create login request with wrong password
        AuthRequest authRequest = AuthRequest.builder()
                .username(testUsername)
                .password("wrongpassword")
                .build();

        // Perform login
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testTokenRefresh() throws Exception {
        // First, login to get tokens
        AuthRequest authRequest = AuthRequest.builder()
                .username(testUsername)
                .password(testPassword)
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andReturn();

        // Extract refresh token
        AuthResponse authResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponse.class);

        String refreshToken = authResponse.getRefreshToken();

        // Use refresh token to get new access token
        mockMvc.perform(post("/api/auth/refresh-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(refreshToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
    }
}
