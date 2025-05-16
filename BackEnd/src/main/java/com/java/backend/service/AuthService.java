package com.java.backend.service;

import com.java.backend.dto.request.LoginRequest;
import com.java.backend.dto.request.RegisterRequest;
import com.java.backend.dto.response.JwtResponse;
import com.java.backend.entity.UserEntity;
import com.java.backend.entity.RoleEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.UserRepository;
import com.java.backend.repository.RoleRepository;
import com.java.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public JwtResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateToken(authentication);
            
            UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            
            return JwtResponse.builder()
                .token(jwt)
                .id(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(Collections.singletonList(user.getRole().getName()))
                .build();
        } catch (Exception e) {
            log.error("Error during login: {}", e.getMessage());
            throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
        }
    }
    
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        // Validate username and email
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        
        try {
            // Create new user
            UserEntity user = new UserEntity();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            
            // Set default role (USER)
            RoleEntity userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            user.setRole(userRole);
            
            userRepository.save(user);
            
            // Generate token
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateToken(authentication);
            
            return JwtResponse.builder()
                .token(jwt)
                .id(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(Collections.singletonList(user.getRole().getName()))
                .build();
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage());
            throw new AppException(ErrorCode.REGISTRATION_FAILED);
        }
    }
}