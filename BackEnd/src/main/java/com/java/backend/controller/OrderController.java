package com.java.backend.controller;

import com.java.backend.dto.request.OrderRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.OrderResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Pagination<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        Pagination<OrderResponse> orders = orderService.getAllOrders(page, size, status);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Orders fetched successfully", orders));
    }
    
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<Pagination<OrderResponse>>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<OrderResponse> orders = orderService.getUserOrders(page, size);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "User orders fetched successfully", orders));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Order fetched successfully", order));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse order = orderService.createOrder(orderRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED.value(), "Order created successfully", order));
    }
    
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId, 
            @RequestParam String status) {
        
        OrderResponse order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Order status updated successfully", order));
    }
    
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long orderId) {
        OrderResponse order = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Order cancelled successfully", order));
    }
}