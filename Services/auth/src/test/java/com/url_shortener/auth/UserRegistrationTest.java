package com.url_shortener.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.url_shortener.auth.DTO.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRegistrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        public void testUserRegistration() throws Exception {
                // Create a registration request
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .username("testuser")
                                .email("test@example.com")
                                .password("password123")
                                .build();

                // Convert to JSON
                String requestJson = objectMapper.writeValueAsString(registerRequest);

                // Perform POST request
                ResultActions result = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson));

                // Verify the response
                result.andExpect(status().isOk())
                                .andExpect(jsonPath("$.username").value("testuser"))
                                .andExpect(jsonPath("$.email").value("test@example.com"))
                                .andExpect(jsonPath("$.token").isNotEmpty())
                                .andExpect(jsonPath("$.refreshToken").isNotEmpty());
        }

        @Test
        public void testUserRegistrationWithInvalidData() throws Exception {
                // Create an invalid registration request (missing email)
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .username("baduser")
                                .password("password123")
                                .build();

                // Convert to JSON
                String requestJson = objectMapper.writeValueAsString(registerRequest);

                // Perform POST request
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson))
                                .andExpect(status().isBadRequest());
        }
}
