package com.java.backend.controller;

import com.java.backend.dto.request.AccessoryRequest;
import com.java.backend.dto.response.AccessoryResponse;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.AccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/accessories")
@RequiredArgsConstructor
public class AccessoryController {
    private final AccessoryService accessoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<AccessoryResponse>>> getAllAccessories(
            @RequestParam(defaultValue = "active") String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<AccessoryResponse> accessories = accessoryService.getAllAccessories(status, categoryId, name, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessories retrieved successfully", accessories));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccessoryResponse>> getAccessoryById(@PathVariable Long id) {
        AccessoryResponse accessory = accessoryService.getAccessoryById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory retrieved successfully", accessory));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> createAccessory(@RequestBody AccessoryRequest accessoryRequest) {
        AccessoryResponse accessory = accessoryService.createAccessory(accessoryRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory created successfully", accessory));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> updateAccessory(@PathVariable Long id, @RequestBody AccessoryRequest accessoryRequest) {
        AccessoryResponse accessory = accessoryService.updateAccessory(id, accessoryRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory updated successfully", accessory));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAccessory(@PathVariable Long id) {
        accessoryService.deleteAccessory(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory deleted successfully", null));
    }
    
    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> uploadAccessoryImages(@PathVariable Long id, @RequestParam("files") List<MultipartFile> files) {
        AccessoryResponse accessory = accessoryService.uploadAccessoryImages(id, files);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory images uploaded successfully", accessory));
    }
    
    @PostMapping("/{id}/thumbnail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccessoryResponse>> uploadAccessoryThumbnail(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        AccessoryResponse accessory = accessoryService.uploadAccessoryThumbnail(id, file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Accessory thumbnail uploaded successfully", accessory));
    }
}