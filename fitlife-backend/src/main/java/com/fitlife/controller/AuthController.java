package com.fitlife.controller;

import com.fitlife.dto.*;
import com.fitlife.exception.BadRequestException;
import com.fitlife.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/security-question")
    public ResponseEntity<Map<String, String>> getSecurityQuestion(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email is required");
        }
        String question = authService.getSecurityQuestion(email);
        return ResponseEntity.ok(Map.of("securityQuestion", question));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String securityAnswer = body.get("securityAnswer");
        String newPassword = body.get("newPassword");

        if (email == null || email.isBlank()) throw new BadRequestException("Email is required");
        if (securityAnswer == null || securityAnswer.isBlank()) throw new BadRequestException("Security answer is required");
        if (newPassword == null || newPassword.length() < 6) throw new BadRequestException("Password must be at least 6 characters");

        authService.verifySecurityAnswerAndResetPassword(email, securityAnswer, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }
}
