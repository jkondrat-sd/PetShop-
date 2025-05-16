package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private Long categoryId;
    private String categoryName;
    private String description;
    private String status;
}