package com.java.backend.controller;

import com.java.backend.dto.request.CategoryRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.CategoryResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<CategoryResponse> categories = categoryService.getAllCategories(page, size);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Categories fetched successfully", categories));
    }
    
    @GetMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long categoryId) {
        CategoryResponse category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Category fetched successfully", category));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> addCategory(@RequestBody CategoryRequest categoryRequest) {
        CategoryResponse category = categoryService.addCategory(categoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED.value(), "Category added successfully", category));
    }
    
    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryRequest categoryRequest) {
        
        CategoryResponse category = categoryService.updateCategory(categoryId, categoryRequest);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Category updated successfully", category));
    }
    
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Category deleted successfully", null));
    }
}