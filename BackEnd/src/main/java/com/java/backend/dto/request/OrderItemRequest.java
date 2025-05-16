package com.java.backend.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String type; // pet/accessory
    private Long itemId;
    private Integer quantity;
}