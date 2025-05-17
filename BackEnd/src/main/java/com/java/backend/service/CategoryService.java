package com.java.backend.service;

import com.java.backend.dto.request.CategoryRequest;
import com.java.backend.dto.response.CategoryResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.entity.CategoryEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final BaseRedisService baseRedisService;

    public Pagination<CategoryResponse> getAllCategories(String status, int page, int size) {
        String cacheKey = "categories:" + status + ":" + page + ":" + size;
        Pagination<CategoryResponse> cachedResult = baseRedisService.get(cacheKey, new TypeReference<Pagination<CategoryResponse>>() {});
        if (cachedResult != null) {
            return cachedResult;
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryEntity> categoryPage = categoryRepository.findByStatus(status, pageable);
        List<CategoryResponse> categories = categoryPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Pagination<CategoryResponse> pagination = Pagination.<CategoryResponse>builder()
                .content(categories)
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .page(page)
                .build();

        baseRedisService.set(cacheKey, pagination, 60 * 24, TimeUnit.MINUTES);
        return pagination;
    }

    public CategoryResponse getCategoryById(Long id) {
        String cacheKey = "category:" + id;
        CategoryResponse cachedCategory = baseRedisService.get(cacheKey, CategoryResponse.class);
        if (cachedCategory != null) {
            return cachedCategory;
        }

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        CategoryResponse response = mapToResponse(category);
        baseRedisService.set(cacheKey, response, 60 * 24, TimeUnit.MINUTES);
        return response;
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        CategoryEntity category = CategoryEntity.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .status(request.getStatus())
                .build();

        CategoryEntity savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (!category.getCategoryName().equals(request.getCategoryName()) &&
                categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());
        category.setStatus(request.getStatus());

        CategoryEntity updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse mapToResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .categoryId(entity.getId())
                .categoryName(entity.getCategoryName())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}