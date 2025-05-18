package com.java.backend.controller;

import com.java.backend.dto.request.BreedRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.BreedResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.BreedService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
@Tag(name = "Breed Management", description = "API for managing pet breeds")
public class BreedController {
    private final BreedService breedService;
    
    @Operation(summary = "Get all breeds", description = "Retrieve a paginated list of all pet breeds")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved breed list"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<BreedResponse>>> getAllBreeds(
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        Pagination<BreedResponse> breeds = breedService.getAllBreeds(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breeds retrieved successfully", breeds));
    }
    
    @Operation(summary = "Get breeds by pet type", description = "Retrieve all breeds for a specific pet type")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved breeds"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/type/{petType}")
    public ResponseEntity<ApiResponse<List<BreedResponse>>> getBreedsByPetType(
            @Parameter(description = "Pet type (e.g., DOG, CAT)", required = true) @PathVariable String petType) {
        List<BreedResponse> breeds = breedService.getBreedsByPetType(petType);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breeds retrieved successfully", breeds));
    }
    
    @Operation(summary = "Get breed by ID", description = "Retrieve details of a specific breed")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved breed"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Breed not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BreedResponse>> getBreedById(
            @Parameter(description = "Breed ID", required = true) @PathVariable Long id) {
        BreedResponse breed = breedService.getBreedById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed retrieved successfully", breed));
    }
    
    @Operation(
        summary = "Create new breed", 
        description = "Create a new pet breed",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Breed created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BreedResponse>> createBreed(
            @Parameter(description = "Breed data", required = true) @RequestBody BreedRequest request) {
        BreedResponse breed = breedService.createBreed(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed created successfully", breed));
    }
    
    @Operation(
        summary = "Update breed", 
        description = "Update an existing breed",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Breed updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Breed not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BreedResponse>> updateBreed(
            @Parameter(description = "Breed ID", required = true) @PathVariable Long id,
            @Parameter(description = "Updated breed data", required = true) @RequestBody BreedRequest request) {
        BreedResponse breed = breedService.updateBreed(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed updated successfully", breed));
    }
    
    @Operation(
        summary = "Delete breed", 
        description = "Delete a breed by ID",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Breed deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Breed not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteBreed(
            @Parameter(description = "Breed ID", required = true) @PathVariable Long id) {
        breedService.deleteBreed(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Breed deleted successfully", null));
    }
}