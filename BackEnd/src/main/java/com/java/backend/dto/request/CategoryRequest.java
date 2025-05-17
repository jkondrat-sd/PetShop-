package com.java.backend.dto.request;

import lombok.Data;

@Data
public class CategoryRequest {
    private String categoryName;
    private String description;
    private String status;
}