package com.java.backend.service;

import com.java.backend.dto.request.UpdateUserRequest;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.UserInfoResponse;
import com.java.backend.entity.RoleEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.RoleRepository;
import com.java.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UploadFileService uploadFileService;
    private final BaseRedisService baseRedisService;
    
    // Lấy thông tin người dùng hiện tại
    public UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
    
    // Kiểm tra quyền ADMIN
    private boolean checkRoleAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }
    
    // Cập nhật thông tin người dùng
    public UserInfoResponse updateUser(UpdateUserRequest request, MultipartFile avatar) {
        UserEntity user = getUser();
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        // Cập nhật avatar nếu có
        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = uploadFileService.uploadFile(avatar);
            user.setAvatar(avatarUrl);
        }
        
        // Cập nhật mật khẩu nếu có
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        UserEntity updatedUser = userRepository.save(user);
        
        // Clear cache
        baseRedisService.deleteKey("user_" + user.getUserId());
        
        List<String> roles = updatedUser.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toList());
        
        return UserInfoResponse.builder()
                .userId(updatedUser.getUserId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .phone(updatedUser.getPhone())
                .address(updatedUser.getAddress())
                .avatar(updatedUser.getAvatar())
                .roles(roles)
                .build();
    }
    
    // Lấy danh sách người dùng (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    public Pagination<UserInfoResponse> getAllUsers(int page, int size) {
        String cacheKey = "users_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<UserInfoResponse>) cachedResult;
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserEntity> userPage = userRepository.findAll(pageable);
            
            List<UserInfoResponse> users = userPage.getContent().stream()
                    .map(this::convertToUserResponse)
                    .collect(Collectors.toList());
            
            Pagination<UserInfoResponse> pagination = new Pagination<>();
            pagination.setContent(users);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(userPage.getTotalElements());
            pagination.setTotalPages(userPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (Exception e) {
            log.error("Error getting all users: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Chuyển đổi từ entity sang response
    private UserInfoResponse convertToUserResponse(UserEntity user) {
        List<String> roles = user.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toList());
        
        return UserInfoResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatar(user.getAvatar())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}