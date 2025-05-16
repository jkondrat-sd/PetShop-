package com.java.backend.service;

import com.java.backend.dto.request.CartRequest;
import com.java.backend.dto.response.CartResponse;
import com.java.backend.entity.AccessoryEntity;
import com.java.backend.entity.PetEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.AccessoryRepository;
import com.java.backend.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final UserService userService;
    private final PetRepository petRepository;
    private final AccessoryRepository accessoryRepository;
    private final BaseRedisService baseRedisService;
    
    // Process cart items (add to cart)
    public CartResponse processCart(CartRequest request) {
        try {
            UserEntity user = userService.getCurrentUser();
            String cartKey = "cart:" + user.getUserId();
            
            List<CartItemResponse> cartItems = new ArrayList<>();
            Double totalAmount = 0.0;
            Integer totalItems = 0;
            
            // Process each item in the cart request
            for (CartItemRequest item : request.getItems()) {
                CartItemResponse cartItem = processCartItem(item);
                if (cartItem != null) {
                    cartItems.add(cartItem);
                    totalAmount += cartItem.getSubtotal();
                    totalItems += cartItem.getQuantity();
                }
            }
            
            // Create cart response
            CartResponse cartResponse = new CartResponse();
            cartResponse.setItems(cartItems);
            cartResponse.setTotalAmount(totalAmount);
            cartResponse.setTotalItems(totalItems);
            
            // Save to Redis
            baseRedisService.setObjectForMinutes(cartKey, cartResponse, 60 * 24); // 24 hours
            
            return cartResponse;
        } catch (Exception e) {
            log.error("Error processing cart: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get cart from Redis
    public CartResponse getCart() {
        UserEntity user = userService.getCurrentUser();
        String cartKey = "cart:" + user.getUserId();
        
        Object cartObj = baseRedisService.get(cartKey);
        if (cartObj == null) {
            return new CartResponse(new ArrayList<>(), 0.0, 0);
        }
        
        return (CartResponse) cartObj;
    }
    
    // Clear cart
    public void clearCart() {
        UserEntity user = userService.getCurrentUser();
        String cartKey = "cart:" + user.getUserId();
        baseRedisService.delete(cartKey);
    }
    
    // Process individual cart item
    private CartItemResponse processCartItem(CartItemRequest item) {
        if ("pet".equals(item.getItemType())) {
            PetEntity pet = petRepository.findById(item.getItemId())
                    .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
            
            if (!"available".equals(pet.getStatus())) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Pet is not available");
            }
            
            double subtotal = pet.getUnitPrice();
            
            return CartItemResponse.builder()
                    .itemType("pet")
                    .itemId(pet.getPetId())
                    .name(pet.getPetName())
                    .thumbnail(pet.getThumbnail())
                    .price(pet.getUnitPrice())
                    .quantity(1) // Only can buy 1 pet at a time
                    .subtotal(subtotal)
                    .build();
                    
        } else if ("accessory".equals(item.getItemType())) {
            AccessoryEntity accessory = accessoryRepository.findById(item.getItemId())
                    .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
            
            if (!"active".equals(accessory.getStatus())) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Accessory is not active");
            }
            
            if (accessory.getStock() < item.getQuantity()) {
                throw new AppException(ErrorCode.OUT_OF_STOCK, "Insufficient stock for " + accessory.getName());
            }
            
            double subtotal = accessory.getUnitPrice() * item.getQuantity();
            
            return CartItemResponse.builder()
                    .itemType("accessory")
                    .itemId(accessory.getAccessoryId())
                    .name(accessory.getName())
                    .thumbnail(accessory.getThumbnail())
                    .price(accessory.getUnitPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();
        }
        
        return null;
    }
}