package com.java.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long orderId;
    private Double amount;
    private String paymentMethod; // card, banking, cod, etc.
    private String cardNumber;
    private String cardHolder;
    private String expiryDate;
    private String cvv;
    private String bankCode;
}