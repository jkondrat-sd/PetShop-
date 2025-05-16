package com.java.backend.service;

import com.cloudinary.Cloudinary;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UploadFileService {
    private final Cloudinary cloudinary;
    
    public String uploadFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new AppException(ErrorCode.BAD_REQUEST, "File is empty");
            }
            
            // Tạo tên file ngẫu nhiên để tránh trùng lặp
            String publicId = UUID.randomUUID().toString();
            
            // Upload file lên Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader()
                    .upload(file.getBytes(), Map.of(
                            "public_id", publicId,
                            "folder", "pet-shop",
                            "resource_type", "auto"
                    ));
            
            // Trả về URL của file đã upload
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
    }
    
    public List<String> uploadMultipleFiles(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            urls.add(uploadFile(file));
        }
        
        return urls;
    }
    
    public void deleteFile(String url) {
        try {
            // Lấy public_id từ URL
            String publicId = extractPublicIdFromUrl(url);
            
            // Xóa file trên Cloudinary
            cloudinary.uploader().destroy(publicId, Map.of());
        } catch (IOException e) {
            log.error("Error deleting file: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to delete file");
        }
    }
    
    private String extractPublicIdFromUrl(String url) {
        // Xử lý để trích xuất public_id từ URL của Cloudinary
        // Ví dụ: https://res.cloudinary.com/demo/image/upload/v1234567890/pet-shop/abcdef.jpg
        // => pet-shop/abcdef
        
        String[] parts = url.split("/");
        return parts[parts.length - 2] + "/" + parts[parts.length - 1].split("\\.")[0];
    }
}