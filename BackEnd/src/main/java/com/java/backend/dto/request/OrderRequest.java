package com.java.backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String shipName;
    private String shipAddress;
    private Double freight;
    private String paymentMethod;
    private List<OrderItemRequest> items;
}