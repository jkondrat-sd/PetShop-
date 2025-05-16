package com.java.backend.service;

import com.java.backend.dto.request.PaymentRequest;
import com.java.backend.dto.response.PaymentResponse;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PaymentService {
    private final OrderService orderService;
    private final EmailService emailService;

    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        try {
            // Kiểm tra thông tin thanh toán
            validatePaymentRequest(paymentRequest);
            
            // Xử lý thanh toán - trong thực tế sẽ tích hợp với cổng thanh toán
            // như PayPal, Stripe, VNPay, v.v.
            
            // Cập nhật trạng thái đơn hàng
            orderService.updateOrderStatus(paymentRequest.getOrderId(), "paid");
            
            // Gửi email xác nhận thanh toán
            emailService.sendPaymentConfirmation(paymentRequest.getOrderId());
            
            return PaymentResponse.builder()
                    .success(true)
                    .transactionId(generateTransactionId())
                    .orderId(paymentRequest.getOrderId())
                    .amount(paymentRequest.getAmount())
                    .paymentMethod(paymentRequest.getPaymentMethod())
                    .build();
        } catch (Exception e) {
            log.error("Error processing payment: {}", e.getMessage());
            throw new AppException(ErrorCode.PAYMENT_FAILED);
        }
    }
    
    private void validatePaymentRequest(PaymentRequest request) {
        if (request.getOrderId() == null) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Order ID is required");
        }
        
        if (request.getAmount() <= 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Invalid payment amount");
        }
        
        if (request.getPaymentMethod() == null || request.getPaymentMethod().isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Payment method is required");
        }
    }
    
    private String generateTransactionId() {
        // Tạo ID giao dịch ngẫu nhiên
        return "TXN-" + System.currentTimeMillis() + "-" + Math.abs(System.nanoTime() % 1000);
    }
}