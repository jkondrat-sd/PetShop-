package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private List<CartItemResponse> items;
    private Double totalAmount;
    private Integer totalItems;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class CartItemResponse {
    private String itemType;
    private Long itemId;
    private String name;
    private String thumbnail;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}