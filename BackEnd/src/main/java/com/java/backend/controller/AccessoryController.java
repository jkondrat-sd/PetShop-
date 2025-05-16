package com.java.backend.controller;

import com.java.backend.dto.request.AccessoryRequest;
import com.java.backend.dto.response.AccessoryResponse;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.AccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId) {
        
        Pagination<AccessoryResponse> accessories = accessoryService.getAllAccessories(page, size, categoryId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Accessories fetched successfully", accessories));
    }
    
    @GetMapping("/{accessoryId}")
    public ResponseEntity<ApiResponse<AccessoryResponse>> getAccessoryById(@PathVariable Long accessoryId) {
        AccessoryResponse accessory = accessoryService.getAccessoryById(accessoryId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Accessory fetched successfully", accessory));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<AccessoryResponse>> addAccessory(
            @RequestPart("accessory") AccessoryRequest accessoryRequest,
            @RequestPart("thumbnail") MultipartFile thumbnail,
            @RequestPart("images") List<MultipartFile> images) {
        
        AccessoryResponse accessory = accessoryService.addAccessory(accessoryRequest, thumbnail, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED.value(), "Accessory added successfully", accessory));
    }
    
    @PutMapping("/{accessoryId}")
    public ResponseEntity<ApiResponse<AccessoryResponse>> updateAccessory(
            @PathVariable Long accessoryId,
            @RequestPart(value = "accessory") AccessoryRequest accessoryRequest,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        
        AccessoryResponse accessory = accessoryService.updateAccessory(accessoryId, accessoryRequest, thumbnail, images);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Accessory updated successfully", accessory));
    }
    
    @DeleteMapping("/{accessoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteAccessory(@PathVariable Long accessoryId) {
        accessoryService.deleteAccessory(accessoryId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Accessory deleted successfully", null));
    }
}