package com.java.backend.service;

import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UploadFileService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.url:http://localhost:8080/uploads}")
    private String uploadUrl;

    public String uploadFile(MultipartFile file) {
        try {
            // Kiểm tra file
            if (file == null || file.isEmpty()) {
                throw new AppException(ErrorCode.BAD_REQUEST);
            }

            // Tạo thư mục upload nếu chưa tồn tại
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file duy nhất
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Lưu file
            Path filePath = uploadPath.resolve(uniqueFileName);
            file.transferTo(filePath.toFile());

            // Trả về URL của file
            return uploadUrl + "/" + uniqueFileName;
        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public boolean deleteFile(String fileUrl) {
        try {
            // Extract filename from URL
            if (fileUrl == null || fileUrl.isEmpty()) {
                return false;
            }

            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            File fileToDelete = filePath.toFile();

            if (fileToDelete.exists()) {
                return fileToDelete.delete();
            }
            return false;
        } catch (Exception e) {
            log.error("Error deleting file: {}", e.getMessage());
            return false;
        }
    }
}