package com.java.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.CartResponse;
import com.java.backend.entity.UserEntity;
import com.java.backend.service.BaseRedisService;
import com.java.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/redis-debug")
@RequiredArgsConstructor
@Slf4j
public class RedisDebugController {
    
    private final BaseRedisService baseRedisService;
    private final UserService userService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    
    @GetMapping("/cart-key")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkCartKey() {
        try {
            UserEntity user = userService.getCurrentUser();
            String cartKey = "cart:" + user.getUserId();
            
            // Kiểm tra dữ liệu trong Redis
            Object rawData = baseRedisService.getRawValue(cartKey);
            CartResponse cartData = baseRedisService.get(cartKey, CartResponse.class);
            
            Map<String, Object> result = new HashMap<>();
            result.put("userId", user.getUserId());
            result.put("cartKey", cartKey);
            result.put("rawData", rawData);
            result.put("cartData", cartData);
            result.put("hasRawData", rawData != null);
            result.put("hasCartData", cartData != null);
            
            if (cartData != null) {
                result.put("itemsCount", cartData.getItems() != null ? cartData.getItems().size() : 0);
                result.put("totalItems", cartData.getTotalItems());
            }
            
            // Sửa lại phần này để phù hợp với ApiResponse của project
            ApiResponse<Map<String, Object>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Redis cart data retrieved successfully");
            response.setData(result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking Redis cart data", e);
            
            // Sửa lại phần này để phù hợp với ApiResponse của project
            ApiResponse<Map<String, Object>> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/fix-carts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> fixAllCarts() {
        try {
            // Lấy tất cả keys liên quan đến giỏ hàng
            Set<String> cartKeys = redisTemplate.keys("cart:*");
            Map<String, Object> results = new HashMap<>();
            
            if (cartKeys == null || cartKeys.isEmpty()) {
                results.put("status", "No cart keys found in Redis");
                
                ApiResponse<Map<String, Object>> response = new ApiResponse<>();
                response.setSuccess(true);
                response.setMessage("No carts to fix");
                response.setData(results);
                
                return ResponseEntity.ok(response);
            }
            
            results.put("totalKeys", cartKeys.size());
            List<Map<String, Object>> fixedCarts = new ArrayList<>();
            
            for (String cartKey : cartKeys) {
                Map<String, Object> cartResult = new HashMap<>();
                cartResult.put("key", cartKey);
                
                // Lấy dữ liệu hiện tại
                Object rawData = baseRedisService.getRawValue(cartKey);
                cartResult.put("hadRawData", rawData != null);
                
                try {
                    // Tạo cart mới từ raw data nếu có
                    CartResponse cartData = null;
                    if (rawData != null) {
                        try {
                            cartData = objectMapper.convertValue(rawData, CartResponse.class);
                        } catch (Exception e) {
                            log.error("Cannot convert raw data for key: {}", cartKey, e);
                        }
                    }
                    
                    // Nếu không chuyển được, tạo cart mới
                    if (cartData == null) {
                        cartData = new CartResponse(new ArrayList<>(), 0.0, 0);
                    }
                    
                    // Đảm bảo dữ liệu hợp lệ
                    if (cartData.getItems() == null) {
                        cartData.setItems(new ArrayList<>());
                    }
                    
                    // Lưu lại cart với serialization mới
                    baseRedisService.set(cartKey, cartData, 24 * 60, TimeUnit.MINUTES);
                    
                    // Kiểm tra xem lưu thành công không
                    CartResponse verifiedCart = baseRedisService.get(cartKey, CartResponse.class);
                    boolean success = verifiedCart != null && verifiedCart.getItems() != null;
                    
                    cartResult.put("fixed", success);
                    cartResult.put("itemCount", success ? verifiedCart.getItems().size() : 0);
                    
                    fixedCarts.add(cartResult);
                    
                } catch (Exception e) {
                    cartResult.put("fixed", false);
                    cartResult.put("error", e.getMessage());
                    fixedCarts.add(cartResult);
                }
            }
            
            results.put("fixedCarts", fixedCarts);
            
            ApiResponse<Map<String, Object>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Cart fixing completed");
            response.setData(results);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fixing carts", e);
            
            ApiResponse<Map<String, Object>> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}