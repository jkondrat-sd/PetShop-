package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userName;
    private LocalDateTime orderDate;
    private LocalDateTime shippedDate;
    private Double totalAmount;
    private Double freight;
    private String shipName;
    private String shipAddress;
    private String status;
    private List<OrderDetailResponse> orderDetails;
}