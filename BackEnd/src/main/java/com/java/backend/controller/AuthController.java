package com.java.backend.controller;

import com.java.backend.dto.request.LoginRequest;
import com.java.backend.dto.request.RegisterRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.JwtResponse;
import com.java.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API for user authentication and registration")
public class AuthController {
    private final AuthService authService;
    
    @Operation(summary = "User login", description = "Authenticate a user and return JWT token")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", 
            description = "Login successful",
            content = @Content(schema = @Schema(implementation = JwtResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(
            @Parameter(description = "Login credentials", required = true) 
            @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successfully", response));
    }
    
    @Operation(summary = "User registration", description = "Register a new user and return JWT token")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", 
            description = "Registration successful",
            content = @Content(schema = @Schema(implementation = JwtResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid registration data or email already exists"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtResponse>> register(
            @Parameter(description = "Registration details", required = true) 
            @RequestBody RegisterRequest request) {
        JwtResponse response = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Register successfully", response));
    }
}