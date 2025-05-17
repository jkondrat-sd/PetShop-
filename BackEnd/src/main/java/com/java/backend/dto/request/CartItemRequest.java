package com.java.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
    private String itemType; // "pet" or "accessory"
    private Long itemId; // petId or accessoryId
    private Integer quantity;
}