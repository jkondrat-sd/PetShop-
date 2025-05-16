package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private String username;
    private Date orderDate;
    private String status;
    private String shippingAddress;
    private String contactPhone;
    private String paymentMethod;
    private Double totalAmount;
    private List<OrderDetailResponse> orderDetails;
}