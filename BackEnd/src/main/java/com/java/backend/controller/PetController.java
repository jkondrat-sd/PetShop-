package com.java.backend.controller;

import com.java.backend.dto.request.PetRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.PetResponse;
import com.java.backend.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
@Tag(name = "Pet Management", description = "API for managing pets including CRUD operations")
public class PetController {
    private final PetService petService;
    
    @Operation(summary = "Get all pets", description = "Retrieve a paginated list of pets with optional filtering")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved pet list"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<PetResponse>>> getAllPets(
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Pet type filter") @RequestParam(required = false) String type,
            @Parameter(description = "Breed ID filter") @RequestParam(required = false) Long breedId) {
        
        Pagination<PetResponse> pets = petService.getAllPets(page, size, type, breedId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pets retrieved successfully", pets));
    }
    
    @Operation(summary = "Get pet by ID", description = "Retrieve details of a specific pet")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved pet"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Pet not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetResponse>> getPetById(
            @Parameter(description = "Pet ID", required = true) @PathVariable Long id) {
        PetResponse pet = petService.getPetById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet retrieved successfully", pet));
    }
    
    @Operation(
        summary = "Create new pet", 
        description = "Create a new pet with images",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Pet created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PetResponse>> createPet(
            @Parameter(description = "Pet data") @ModelAttribute PetRequest petRequest,
            @Parameter(description = "Pet thumbnail image") @RequestParam("thumbnail") MultipartFile thumbnail,
            @Parameter(description = "Pet additional images") @RequestParam("images") List<MultipartFile> images) {
        PetResponse pet = petService.addPet(petRequest, thumbnail, images);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet created successfully", pet));
    }
    
    @Operation(
        summary = "Update pet", 
        description = "Update an existing pet's details and images",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Pet updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Pet not found")
    })
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PetResponse>> updatePet(
            @Parameter(description = "Pet ID", required = true) @PathVariable Long id,
            @Parameter(description = "Updated pet data") @ModelAttribute PetRequest petRequest,
            @Parameter(description = "New pet thumbnail image (optional)") 
                @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @Parameter(description = "New pet images (optional)") 
                @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        PetResponse pet = petService.updatePet(id, petRequest, thumbnail, images);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet updated successfully", pet));
    }
    
    @Operation(
        summary = "Delete pet", 
        description = "Delete a pet by ID",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Pet deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Pet not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deletePet(
            @Parameter(description = "Pet ID", required = true) @PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Pet deleted successfully", null));
    }
}