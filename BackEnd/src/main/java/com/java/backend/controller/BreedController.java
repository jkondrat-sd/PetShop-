package com.java.backend.controller;

import com.java.backend.dto.request.BreedRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.BreedResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.BreedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Breeds fetched successfully", breeds));
    }
    
    @GetMapping("/type/{petType}")
    public ResponseEntity<ApiResponse<List<BreedResponse>>> getBreedsByType(@PathVariable String petType) {
        List<BreedResponse> breeds = breedService.getBreedsByType(petType);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Breeds fetched successfully", breeds));
    }
    
    @GetMapping("/{breedId}")
    public ResponseEntity<ApiResponse<BreedResponse>> getBreedById(@PathVariable Long breedId) {
        BreedResponse breed = breedService.getBreedById(breedId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Breed fetched successfully", breed));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<BreedResponse>> addBreed(@RequestBody BreedRequest breedRequest) {
        BreedResponse breed = breedService.addBreed(breedRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED.value(), "Breed added successfully", breed));
    }
    
    @PutMapping("/{breedId}")
    public ResponseEntity<ApiResponse<BreedResponse>> updateBreed(
            @PathVariable Long breedId,
            @RequestBody BreedRequest breedRequest) {
        
        BreedResponse breed = breedService.updateBreed(breedId, breedRequest);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Breed updated successfully", breed));
    }
    
    @DeleteMapping("/{breedId}")
    public ResponseEntity<ApiResponse<Void>> deleteBreed(@PathVariable Long breedId) {
        breedService.deleteBreed(breedId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Breed deleted successfully", null));
    }
}