package com.java.backend.controller;

import com.java.backend.dto.request.CartRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.CartResponse;
import com.java.backend.entity.UserEntity;
import com.java.backend.service.BaseRedisService;
import com.java.backend.service.CartService;
import com.java.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {
    private final CartService cartService;
    private final UserService userService;
    private final BaseRedisService baseRedisService;
    
    // GỘP 2 PHƯƠNG THỨC @PostMapping THÀNH 1
    @PostMapping
    public ResponseEntity<ApiResponse<CartResponse>> processCart(@RequestBody CartRequest request) {
        try {
            log.info("Processing cart request: {}", request);
            CartResponse cart = cartService.processCart(request);
            
            // Lấy lại giỏ hàng hiện tại để xác nhận
            CartResponse currentCart = cartService.getCart();
            log.info("Cart after processing: {} items", 
                    currentCart.getItems() != null ? currentCart.getItems().size() : 0);
            
            ApiResponse<CartResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Cart processed successfully");
            response.setData(currentCart); // Trả về giỏ hàng hiện tại sau khi xử lý
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing cart", e);
            
            ApiResponse<CartResponse> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        try {
            CartResponse response = cartService.getCart();
            ApiResponse<CartResponse> apiResponse = new ApiResponse<>();
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Cart retrieved successfully");
            apiResponse.setData(response);
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            log.error("Error getting cart", e);
            ApiResponse<CartResponse> apiResponse = new ApiResponse<>();
            apiResponse.setSuccess(false);
            apiResponse.setMessage("Error: " + e.getMessage());
            return ResponseEntity.ok(apiResponse);
        }
    }
    
    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart() {
        try {
            cartService.clearCart();
            ApiResponse<String> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Cart cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error clearing cart", e);
            ApiResponse<String> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyCartStorage() {
        try {
            UserEntity user = userService.getCurrentUser();
            String cartKey = "cart:" + user.getUserId();
            
            // Tạo một giỏ hàng tạm để lưu và kiểm tra
            CartResponse testCart = new CartResponse();
            testCart.setItems(new ArrayList<>());
            testCart.setTotalAmount(0.0);
            testCart.setTotalItems(0);
            
            // Lưu vào Redis
            boolean saveSuccess = baseRedisService.set(cartKey, testCart, 5, TimeUnit.MINUTES);
            
            // Lấy lại từ Redis
            CartResponse retrievedCart = baseRedisService.get(cartKey, CartResponse.class);
            
            // Kết quả kiểm tra
            Map<String, Object> result = new HashMap<>();
            result.put("cartKey", cartKey);
            result.put("saveSuccess", saveSuccess);
            result.put("retrieveSuccess", retrievedCart != null);
            result.put("retrievedData", retrievedCart);
            
            // Tạo response đúng cách
            ApiResponse<Map<String, Object>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Cart storage verification completed");
            response.setData(result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying cart storage", e);
            
            ApiResponse<Map<String, Object>> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}