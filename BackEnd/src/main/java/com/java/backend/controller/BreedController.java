package com.java.backend.controller;

import com.java.backend.dto.request.BreedRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.BreedResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.BreedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {
    private final BreedService breedService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<BreedResponse>>> getAllBreeds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pagination<BreedResponse> breeds = breedService.getAllBreeds(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breeds retrieved successfully", breeds));
    }
    
    @GetMapping("/type/{petType}")
    public ResponseEntity<ApiResponse<List<BreedResponse>>> getBreedsByPetType(@PathVariable String petType) {
        List<BreedResponse> breeds = breedService.getBreedsByPetType(petType);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breeds retrieved successfully", breeds));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BreedResponse>> getBreedById(@PathVariable Long id) {
        BreedResponse breed = breedService.getBreedById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed retrieved successfully", breed));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BreedResponse>> createBreed(@RequestBody BreedRequest request) {
        BreedResponse breed = breedService.createBreed(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed created successfully", breed));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BreedResponse>> updateBreed(@PathVariable Long id, @RequestBody BreedRequest request) {
        BreedResponse breed = breedService.updateBreed(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed updated successfully", breed));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteBreed(@PathVariable Long id) {
        breedService.deleteBreed(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed deleted successfully", null));
    }
}