package com.java.backend.dto.request;

import lombok.Data;

@Data
public class AccessoryRequest {
    private String accessoryName;
    private String description;
    private Long id;
    private Double unitPrice;
    private Integer stockQuantity;
    private String status;
}