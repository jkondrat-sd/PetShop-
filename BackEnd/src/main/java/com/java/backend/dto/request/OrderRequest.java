package com.java.backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String contactPhone;
    private String paymentMethod;
    private List<OrderItemRequest> items;
}