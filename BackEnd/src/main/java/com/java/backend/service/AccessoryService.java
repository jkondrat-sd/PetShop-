package com.java.backend.service;

import com.java.backend.entity.AccessoryEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.entity.CategoryEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.dto.request.AccessoryRequest;
import com.java.backend.dto.response.AccessoryResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.repository.AccessoryRepository;
import com.java.backend.repository.CategoryRepository;
import com.java.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AccessoryService {
    private final AccessoryRepository accessoryRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
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

    // Thêm phụ kiện mới
    @PreAuthorize("hasRole('ADMIN')")
    public AccessoryResponse addAccessory(AccessoryRequest request, MultipartFile thumbnailFile, List<MultipartFile> imageFiles) {
        try {
            // Kiểm tra category tồn tại
            CategoryEntity category = categoryRepository.findById(request.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

            // Upload thumbnail
            String thumbnail = uploadFileService.uploadFile(thumbnailFile);
            
            // Upload images
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile imageFile : imageFiles) {
                String imageUrl = uploadFileService.uploadFile(imageFile);
                imageUrls.add(imageUrl);
            }
            
            // Lưu dữ liệu vào DB
            AccessoryEntity accessory = AccessoryEntity.builder()
                    .accessoryName(request.getAccessoryName())
                    .description(request.getDescription())
                    .category(category)
                    .unitPrice(request.getUnitPrice())
                    .stockQuantity(request.getStockQuantity())
                    .status("active")
                    .thumbnail(thumbnail)
                    .images(String.join(",", imageUrls))
                    .build();
            
            AccessoryEntity savedAccessory = accessoryRepository.save(accessory);
            
            // Clear cache
            baseRedisService.deleteKeys("accessories_*");
            
            return convertToAccessoryResponse(savedAccessory);
        } catch (Exception e) {
            log.error("Error adding accessory: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy danh sách phụ kiện
    public Pagination<AccessoryResponse> getAllAccessories(String status, Long id, String name, int page, int size) {
        String cacheKey = "accessories_" + status + "_" + id + "_" + name + "_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey, new TypeReference<Pagination<AccessoryResponse>>() {});
        if (cachedResult != null) {
            return (Pagination<AccessoryResponse>) cachedResult;
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<AccessoryEntity> accessoryPage;
            
            if (id != null) {
                accessoryPage =  accessoryRepository.findByCategory_IdAndStatus(id, status, pageable);
            } else if (name != null && !name.isEmpty()) {
                accessoryPage = accessoryRepository.findByAccessoryNameContainingIgnoreCase(name, pageable);
            } else {
                accessoryPage = accessoryRepository.findByStatus(status, pageable);
            }
            
            List<AccessoryResponse> accessories = accessoryPage.getContent().stream()
                    .map(this::convertToAccessoryResponse)
                    .collect(Collectors.toList());
            
            Pagination<AccessoryResponse> pagination = Pagination.<AccessoryResponse>builder()
                    .content(accessories)
                    .page(page)
                    .size(size)
                    .totalElements(accessoryPage.getTotalElements())
                    .totalPages(accessoryPage.getTotalPages())
                    .build();
            
            // Lưu vào cache
            baseRedisService.set(cacheKey, pagination, 10, TimeUnit.MINUTES);
            
            return pagination;
        } catch (Exception e) {
            log.error("Error getting accessories: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy thông tin chi tiết phụ kiện
    public AccessoryResponse getAccessoryById(Long accessoryId) {
        String cacheKey = "accessory_" + accessoryId;
        
        // Kiểm tra cache
        AccessoryResponse cachedResult = baseRedisService.get(cacheKey, new TypeReference<AccessoryResponse>() {});
        if (cachedResult != null) {
            return cachedResult;
        }
        
        AccessoryEntity accessory = accessoryRepository.findById(accessoryId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
        
        AccessoryResponse response = convertToAccessoryResponse(accessory);
        
        // Lưu vào cache
        baseRedisService.set(cacheKey, response, 30, TimeUnit.MINUTES);
        
        return response;
    }

    // Cập nhật thông tin phụ kiện
    @PreAuthorize("hasRole('ADMIN')")
    public AccessoryResponse updateAccessory(Long accessoryId, AccessoryRequest request) {
        AccessoryEntity accessory = accessoryRepository.findById(accessoryId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
        
        // Cập nhật thông tin danh mục nếu có
        if (request.getId() != null) {
            CategoryEntity category = categoryRepository.findById(request.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            accessory.setCategory(category);
        }
        
        // Cập nhật các thông tin khác
        if (request.getAccessoryName() != null) accessory.setAccessoryName(request.getAccessoryName());
        if (request.getDescription() != null) accessory.setDescription(request.getDescription());
        if (request.getUnitPrice() != null) accessory.setUnitPrice(request.getUnitPrice());
        if (request.getStockQuantity() != null) accessory.setStockQuantity(request.getStockQuantity());
        if (request.getStatus() != null) accessory.setStatus(request.getStatus());
        
        AccessoryEntity updatedAccessory = accessoryRepository.save(accessory);
        
        // Clear cache
        baseRedisService.deleteKey("accessory_" + accessoryId);
        baseRedisService.deleteKeys("accessories_*");
        
        return convertToAccessoryResponse(updatedAccessory);
    }

    // Xóa phụ kiện
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAccessory(Long accessoryId) {
        AccessoryEntity accessory = accessoryRepository.findById(accessoryId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
        
        // Soft delete - set status to inactive
        accessory.setStatus("inactive");
        accessoryRepository.save(accessory);
        
        // Clear cache
        baseRedisService.deleteKey("accessory_" + accessoryId);
        baseRedisService.deleteKeys("accessories_*");
    }
    
    // Chuyển đổi từ entity sang response
    private AccessoryResponse convertToAccessoryResponse(AccessoryEntity accessory) {
        List<String> imagesList = new ArrayList<>();
        if (accessory.getImages() != null && !accessory.getImages().isEmpty()) {
            String[] imagesArray = accessory.getImages().split(",");
            for (String image : imagesArray) {
                imagesList.add(image);
            }
        }
        
        return AccessoryResponse.builder()
                .accessoryId(accessory.getAccessoryId())
                .accessoryName(accessory.getAccessoryName())
                .description(accessory.getDescription())
                .category(accessory.getCategory() != null ? accessory.getCategory().getCategoryName() : null)
                .categoryId(accessory.getCategory() != null ? accessory.getCategory().getId() : null)
                .unitPrice(accessory.getUnitPrice())
                .stockQuantity(accessory.getStockQuantity())
                .status(accessory.getStatus())
                .thumbnail(accessory.getThumbnail())
                .images(imagesList)
                .createdAt(accessory.getCreatedAt())
                .updatedAt(accessory.getUpdatedAt())
                .build();
    }

    public AccessoryResponse createAccessory(AccessoryRequest request) {
        try {
            // Kiểm tra category tồn tại
            CategoryEntity category = categoryRepository.findById(request.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            
            // Lưu dữ liệu vào DB
            AccessoryEntity accessory = AccessoryEntity.builder()
                    .accessoryName(request.getAccessoryName())
                    .description(request.getDescription())
                    .category(category)
                    .unitPrice(request.getUnitPrice())
                    .stockQuantity(request.getStockQuantity())
                    .status("active")
                    .build();
            
            AccessoryEntity savedAccessory = accessoryRepository.save(accessory);
            
            // Clear cache
            baseRedisService.deleteKeys("accessories_*");
            
            return convertToAccessoryResponse(savedAccessory);
        } catch (Exception e) {
            log.error("Error adding accessory: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public AccessoryResponse uploadAccessoryImages(Long accessoryId, List<MultipartFile> files) {
        AccessoryEntity accessory = accessoryRepository.findById(accessoryId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
        
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String imageUrl = uploadFileService.uploadFile(file);
            imageUrls.add(imageUrl);
        }
        
        accessory.setImages(String.join(",", imageUrls));
        AccessoryEntity updatedAccessory = accessoryRepository.save(accessory);
        
        // Clear cache
        baseRedisService.deleteKey("accessory_" + accessoryId);
        baseRedisService.deleteKeys("accessories_*");
        
        return convertToAccessoryResponse(updatedAccessory);
    }

    public AccessoryResponse uploadAccessoryThumbnail(Long accessoryId, MultipartFile file) {
        AccessoryEntity accessory = accessoryRepository.findById(accessoryId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
        
        String thumbnail = uploadFileService.uploadFile(file);
        accessory.setThumbnail(thumbnail);
        
        AccessoryEntity updatedAccessory = accessoryRepository.save(accessory);
        
        // Clear cache
        baseRedisService.deleteKey("accessory_" + accessoryId);
        baseRedisService.deleteKeys("accessories_*");
        
        return convertToAccessoryResponse(updatedAccessory);
    }
}