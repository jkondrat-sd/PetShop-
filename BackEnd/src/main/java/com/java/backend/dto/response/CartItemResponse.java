package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private String itemType;
    private Long itemId;
    private String name;
    private String thumbnail;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}