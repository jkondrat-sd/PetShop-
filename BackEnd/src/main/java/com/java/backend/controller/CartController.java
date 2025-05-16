package com.java.backend.controller;

import com.java.backend.dto.request.CartRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.CartResponse;
import com.java.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@RequestBody CartRequest request) {
        CartResponse response = cartService.processCart(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart processed successfully", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        CartResponse response = cartService.getCart();
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart retrieved successfully", response));
    }
    
    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(new ApiResponse<>(true, "Cart cleared successfully", null));
    }
}