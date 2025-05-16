package com.java.backend.service;

import com.java.backend.dto.request.CategoryRequest;
import com.java.backend.dto.response.CategoryResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.entity.CategoryEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final BaseRedisService baseRedisService;

    public Pagination<CategoryResponse> getAllCategories(int page, int size) {
        String cacheKey = "categories_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<CategoryResponse>) cachedResult;
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CategoryEntity> categoryPage = categoryRepository.findByStatus("active", pageable);
            
            List<CategoryResponse> categories = categoryPage.getContent().stream()
                    .map(this::convertToCategoryResponse)
                    .collect(Collectors.toList());
            
            Pagination<CategoryResponse> pagination = new Pagination<>();
            pagination.setContent(categories);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(categoryPage.getTotalElements());
            pagination.setTotalPages(categoryPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (Exception e) {
            log.error("Error getting categories: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public CategoryResponse getCategoryById(Long categoryId) {
        String cacheKey = "category_" + categoryId;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof CategoryResponse) {
            return (CategoryResponse) cachedResult;
        }
        
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        
        CategoryResponse response = convertToCategoryResponse(category);
        
        // Lưu vào cache
        baseRedisService.setObjectForMinutes(cacheKey, response, 30);
        
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse addCategory(CategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        
        CategoryEntity category = CategoryEntity.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .status("active")
                .build();
        
        CategoryEntity savedCategory = categoryRepository.save(category);
        
        // Clear cache
        baseRedisService.deleteKeys("categories_*");
        
        return convertToCategoryResponse(savedCategory);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        
        // Update fields
        if (request.getCategoryName() != null) category.setCategoryName(request.getCategoryName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getStatus() != null) category.setStatus(request.getStatus());
        
        CategoryEntity updatedCategory = categoryRepository.save(category);
        
        // Clear cache
        baseRedisService.deleteKey("category_" + categoryId);
        baseRedisService.deleteKeys("categories_*");
        
        return convertToCategoryResponse(updatedCategory);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategory(Long categoryId) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        
        // Soft delete - set status to inactive
        category.setStatus("inactive");
        categoryRepository.save(category);
        
        // Clear cache
        baseRedisService.deleteKey("category_" + categoryId);
        baseRedisService.deleteKeys("categories_*");
    }
    
    private CategoryResponse convertToCategoryResponse(CategoryEntity category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .status(category.getStatus())
                .build();
    }
}