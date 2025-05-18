
package com.java.backend.controller;

import com.java.backend.dto.request.OrderRequest;
import com.java.backend.dto.request.PaymentRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.OrderResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.PaymentResponse;
import com.java.backend.service.OrderService;
import com.java.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse order = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order created successfully", order));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<OrderResponse>>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<OrderResponse> orders = orderService.getUserOrders(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", orders));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order retrieved successfully", order));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order cancelled successfully", null));
    }
    
    @PostMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @PathVariable Long id, 
            @RequestBody PaymentRequest paymentRequest) {
        
        // Gán orderId từ đường dẫn
        paymentRequest.setOrderId(id);
        
        PaymentResponse response = paymentService.processPayment(paymentRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thanh toán thành công", response));
    }
    
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Pagination<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<OrderResponse> orders = orderService.getAllOrders(status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved successfully", orders));
    }
    
    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        OrderResponse order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated successfully", order));
    }
}