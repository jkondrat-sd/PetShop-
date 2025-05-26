package com.java.backend.service;

import com.java.backend.dto.request.ChangePasswordRequest;
import com.java.backend.dto.request.UpdateProfileRequest;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.UserResponse;
import com.java.backend.entity.UserEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UploadFileService uploadFileService;
    
    // Get current authenticated user
    public UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
    
    // Get current user profile
    public UserResponse getCurrentUserProfile() {
        UserEntity user = getCurrentUser();
        return mapUserToResponse(user);
    }
    
    // Update user profile
    public UserResponse updateProfile(UpdateProfileRequest request) {
        UserEntity user = getCurrentUser();
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        
        userRepository.save(user);
        return mapUserToResponse(user);
    }
    
    // Change password
    public void changePassword(ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.BAD_REQUEST, "New password and confirm password do not match");
        }
        
        UserEntity user = getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    // Upload avatar
    public UserResponse uploadAvatar(MultipartFile file) {
        UserEntity user = getCurrentUser();
        String avatarUrl = uploadFileService.uploadFile(file);
        user.setAvatar(avatarUrl);
        userRepository.save(user);
        return mapUserToResponse(user);
    }
    
    // Get all users (for admin)
    public Pagination<UserResponse> getAllUsers(int page, int size) {
        Page<UserEntity> userPage = userRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "userId")));
        
        List<UserResponse> users = userPage.getContent()
                .stream()
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());
        
        Pagination<UserResponse> pagination = new Pagination<>();
        pagination.setContent(users);
        pagination.setPage(page);
        pagination.setSize(size);
        pagination.setTotalElements(userPage.getTotalElements());
        pagination.setTotalPages(userPage.getTotalPages());
        
        return pagination;
    }
    
    // Block user (for admin)
    public void blockUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        user.setEnabled(false);
        userRepository.save(user);
    }
    
    // Unblock user (for admin)
    public void unblockUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        user.setEnabled(true);
        userRepository.save(user);
    }
    
    // Get user by ID (for admin)
    public UserEntity getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
    
    // Map UserEntity to UserResponse
    public UserResponse mapUserToResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatar())
                .role(user.getRole().getName())
                .enabled(user.isEnabled())
                .build();
    }
}