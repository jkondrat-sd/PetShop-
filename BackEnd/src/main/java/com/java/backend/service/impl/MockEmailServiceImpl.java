// package com.java.backend.service.impl;

// import com.java.backend.entity.OrderEntity;
// import com.java.backend.entity.UserEntity;
// import com.java.backend.service.EmailService;
// import org.springframework.context.annotation.Primary;
// import org.springframework.stereotype.Service;

// @Service
// @Primary
// public class MockEmailServiceImpl implements EmailService {
    
//     @Override
//     public void sendOrderConfirmation(UserEntity user, OrderEntity order) {
//         System.out.println("MOCK EMAIL: Order confirmation sent");
//     }
    
//     @Override
//     public void sendPaymentConfirmation(UserEntity user, OrderEntity order) {
//         System.out.println("MOCK EMAIL: Payment confirmation sent");
//     }
    
//     @Override
//     public void sendOrderStatusUpdate(UserEntity user, OrderEntity order) {
//         System.out.println("MOCK EMAIL: Order status update sent");
//     }
    
//     // Thêm các phương thức khác theo EmailService interface
// }