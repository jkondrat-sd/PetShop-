package com.java.backend.controller;

import com.java.backend.dto.request.PetRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.PetResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Pets fetched successfully", pets));
    }
    
    @GetMapping("/{petId}")
    public ResponseEntity<ApiResponse<PetResponse>> getPetById(@PathVariable Long petId) {
        PetResponse pet = petService.getPetById(petId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Pet fetched successfully", pet));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<PetResponse>> addPet(
            @RequestPart("pet") PetRequest petRequest,
            @RequestPart("thumbnail") MultipartFile thumbnail,
            @RequestPart("images") List<MultipartFile> images) {
        
        PetResponse pet = petService.addPet(petRequest, thumbnail, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED.value(), "Pet added successfully", pet));
    }
    
    @PutMapping("/{petId}")
    public ResponseEntity<ApiResponse<PetResponse>> updatePet(
            @PathVariable Long petId,
            @RequestPart(value = "pet") PetRequest petRequest,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        
        PetResponse pet = petService.updatePet(petId, petRequest, thumbnail, images);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Pet updated successfully", pet));
    }
    
    @DeleteMapping("/{petId}")
    public ResponseEntity<ApiResponse<Void>> deletePet(@PathVariable Long petId) {
        petService.deletePet(petId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Pet deleted successfully", null));
    }
}