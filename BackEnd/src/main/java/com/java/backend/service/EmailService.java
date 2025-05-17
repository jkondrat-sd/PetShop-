package com.java.backend.service;

import com.java.backend.entity.OrderEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final OrderRepository orderRepository;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.frontend-url}")
    private String frontendUrl;
    
    @Async
    public void sendOrderConfirmation(Long orderId) {
        try {
            OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
                
            UserEntity user = order.getUser();
            
            // Chuẩn bị context cho template
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("name", user.getFirstName() + " " + user.getLastName());
            variables.put("orderId", order.getOrderId());
            variables.put("orderDate", order.getOrderDate());
            variables.put("totalAmount", order.getTotalAmount());
            variables.put("orderUrl", frontendUrl + "/orders/" + order.getOrderId());
            context.setVariables(variables);
            
            // Xử lý template
            String emailContent = templateEngine.process("order-confirmation", context);
            
            // Gửi email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đơn hàng #" + order.getOrderId());
            helper.setText(emailContent, true);
            
            mailSender.send(message);
            
            log.info("Order confirmation email sent for order {}", orderId);
        } catch (Exception e) {
            log.error("Error sending order confirmation email: {}", e.getMessage());
        }
    }
    
    @Async
    public void sendPaymentConfirmation(Long orderId) {
        try {
            OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
                
            UserEntity user = order.getUser();
            
            // Chuẩn bị context cho template
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("name", user.getFirstName() + " " + user.getLastName());
            variables.put("orderId", order.getOrderId());
            variables.put("totalAmount", order.getTotalAmount());
            variables.put("orderUrl", frontendUrl + "/orders/" + order.getOrderId());
            context.setVariables(variables);
            
            // Xử lý template
            String emailContent = templateEngine.process("payment-confirmation", context);
            
            // Gửi email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận thanh toán đơn hàng #" + order.getOrderId());
            helper.setText(emailContent, true);
            
            mailSender.send(message);
            
            log.info("Payment confirmation email sent for order {}", orderId);
        } catch (Exception e) {
            log.error("Error sending payment confirmation email: {}", e.getMessage());
        }
    }
    
    @Async
    public void sendShippingNotification(Long orderId) {
        try {
            OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
                
            UserEntity user = order.getUser();
            
            // Chuẩn bị context cho template
            Context context = new Context();
            Map<String, Object> variables = new HashMap<>();
            variables.put("name", user.getFirstName() + " " + user.getLastName());
            variables.put("orderId", order.getOrderId());
            variables.put("shipName", order.getShipName());
            variables.put("shipAddress", order.getShipAddress());
            variables.put("shippedDate", order.getShippedDate());
            variables.put("trackingUrl", frontendUrl + "/orders/tracking/" + order.getOrderId());
            context.setVariables(variables);
            
            // Xử lý template
            String emailContent = templateEngine.process("shipping-notification", context);
            
            // Gửi email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Đơn hàng #" + order.getOrderId() + " đã được giao");
            helper.setText(emailContent, true);
            
            mailSender.send(message);
            
            log.info("Shipping notification email sent for order {}", orderId);
        } catch (Exception e) {
            log.error("Error sending shipping notification email: {}", e.getMessage());
        }
    }
}