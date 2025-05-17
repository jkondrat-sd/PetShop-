package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AccessoryResponse {
    private Long accessoryId;
    private String accessoryName;
    private String description;
    private String category;
    private Long categoryId;
    private Double unitPrice;
    private Integer stockQuantity;
    private String status;
    private String thumbnail;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}