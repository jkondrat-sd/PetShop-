package com.java.backend.controller;

import com.java.backend.dto.request.LoginRequest;
import com.java.backend.dto.request.RegisterRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.JwtResponse;
import com.java.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successfully", response));
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtResponse>> register(@RequestBody RegisterRequest request) {
        JwtResponse response = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Register successfully", response));
    }
}