package com.java.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartRequest {
    private List<CartItemRequest> items;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class CartItemRequest {
    private String itemType; // "pet" or "accessory"
    private Long itemId; // petId or accessoryId
    private Integer quantity;
}