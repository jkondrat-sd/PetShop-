package com.java.backend.controller;

import com.java.backend.dto.request.PetRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.PetResponse;
import com.java.backend.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<PetResponse>>> getAllPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long breedId) {
        
        Pagination<PetResponse> pets = petService.getAllPets(page, size, type, breedId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pets retrieved successfully", pets));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetResponse>> getPetById(@PathVariable Long id) {
        PetResponse pet = petService.getPetById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet retrieved successfully", pet));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PetResponse>> createPet(
            @RequestBody PetRequest petRequest,
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("images") List<MultipartFile> images) {
        PetResponse pet = petService.addPet(petRequest, thumbnail, images);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet created successfully", pet));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PetResponse>> updatePet(
            @PathVariable Long id,
            @RequestBody PetRequest petRequest,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        PetResponse pet = petService.updatePet(id, petRequest, thumbnail, images);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet updated successfully", pet));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet deleted successfully", null));
    }
}