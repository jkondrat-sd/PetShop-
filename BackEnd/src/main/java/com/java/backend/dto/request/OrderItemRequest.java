package com.java.backend.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String type; // pet/accessory
    private Long itemId; // petId or accessoryId
    private Integer quantity;
}