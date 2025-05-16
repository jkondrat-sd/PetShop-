package com.java.backend.dto.request;

import lombok.Data;

@Data
public class AccessoryRequest {
    private String accessoryName;
    private String description;
    private Long categoryId;
    private Double unitPrice;
    private Integer stockQuantity;
    private String status;
}