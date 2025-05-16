package com.java.backend.controller;

import com.java.backend.dto.request.UpdateProfileRequest;
import com.java.backend.dto.request.ChangePasswordRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.UserResponse;
import com.java.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        UserResponse userResponse = userService.getCurrentUserProfile();
        return ResponseEntity.ok(new ApiResponse<>(true, "User profile retrieved successfully", userResponse));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {
        UserResponse userResponse = userService.updateProfile(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", userResponse));
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
    }
    
    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        UserResponse userResponse = userService.uploadAvatar(file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Avatar uploaded successfully", userResponse));
    }
    
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved successfully", userService.getAllUsers(page, size)));
    }
    
    @PutMapping("/admin/{userId}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> blockUser(@PathVariable Long userId) {
        userService.blockUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User blocked successfully", null));
    }
    
    @PutMapping("/admin/{userId}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> unblockUser(@PathVariable Long userId) {
        userService.unblockUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User unblocked successfully", null));
    }
}