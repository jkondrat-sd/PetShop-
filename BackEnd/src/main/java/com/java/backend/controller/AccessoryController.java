package com.java.backend.controller;

import com.java.backend.dto.request.AccessoryRequest;
import com.java.backend.dto.response.AccessoryResponse;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.AccessoryService;
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
@RequestMapping("/api/accessories")
@RequiredArgsConstructor
@Tag(name = "Accessory Management", description = "API for managing pet accessories")
public class AccessoryController {
    private final AccessoryService accessoryService;
    
    @Operation(summary = "Get all accessories", description = "Retrieve a paginated list of accessories with filtering options")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved accessories list"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<AccessoryResponse>>> getAllAccessories(
            @Parameter(description = "Status filter (active/inactive)") @RequestParam(defaultValue = "active") String status,
            @Parameter(description = "Category ID filter") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Name search") @RequestParam(required = false) String name,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Pagination<AccessoryResponse> accessories = accessoryService.getAllAccessories(status, categoryId, name, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessories retrieved successfully", accessories));
    }
    
    @Operation(summary = "Get accessory by ID", description = "Retrieve details of a specific accessory")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved accessory"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Accessory not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoryResponse>> getAccessoryById(
            @Parameter(description = "Accessory ID", required = true) @PathVariable Long id) {
        AccessoryResponse accessory = accessoryService.getAccessoryById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory retrieved successfully", accessory));
    }
    
    @Operation(
        summary = "Create new accessory", 
        description = "Create a new accessory",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Accessory created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> createAccessory(
            @Parameter(description = "Accessory data", required = true) 
            @RequestBody AccessoryRequest accessoryRequest) {
        AccessoryResponse accessory = accessoryService.createAccessory(accessoryRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory created successfully", accessory));
    }
    
    @Operation(
        summary = "Update accessory", 
        description = "Update an existing accessory",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Accessory updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Accessory not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> updateAccessory(
            @Parameter(description = "Accessory ID", required = true) @PathVariable Long id,
            @Parameter(description = "Updated accessory data", required = true) 
            @RequestBody AccessoryRequest accessoryRequest) {
        AccessoryResponse accessory = accessoryService.updateAccessory(id, accessoryRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory updated successfully", accessory));
    }
    
    @Operation(
        summary = "Delete accessory", 
        description = "Delete an accessory by ID",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Accessory deleted successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Accessory not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAccessory(
            @Parameter(description = "Accessory ID", required = true) @PathVariable Long id) {
        accessoryService.deleteAccessory(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory deleted successfully", null));
    }
    
    @Operation(
        summary = "Upload accessory images", 
        description = "Upload multiple images for an accessory",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Images uploaded successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input or files"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Accessory not found")
    })
    @PostMapping(path = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> uploadAccessoryImages(
            @Parameter(description = "Accessory ID", required = true) @PathVariable Long id,
            @Parameter(description = "Image files", required = true) 
            @RequestParam("files") List<MultipartFile> files) {
        AccessoryResponse accessory = accessoryService.uploadAccessoryImages(id, files);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory images uploaded successfully", accessory));
    }
    
    @Operation(
        summary = "Upload accessory thumbnail", 
        description = "Upload thumbnail image for an accessory",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thumbnail uploaded successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input or file"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Accessory not found")
    })
    @PostMapping(path = "/{id}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> uploadAccessoryThumbnail(
            @Parameter(description = "Accessory ID", required = true) @PathVariable Long id,
            @Parameter(description = "Thumbnail image file", required = true) 
            @RequestParam("file") MultipartFile file) {
        AccessoryResponse accessory = accessoryService.uploadAccessoryThumbnail(id, file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory thumbnail uploaded successfully", accessory));
    }
}