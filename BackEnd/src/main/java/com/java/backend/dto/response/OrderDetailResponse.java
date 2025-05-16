package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderDetailResponse {
    private Long orderDetailId;
    private String itemType;
    private String itemName;
    private Integer quantity;
    private Double unitPrice;
}