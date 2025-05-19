package com.java.backend.service;

import com.java.backend.dto.request.CartRequest;
import com.java.backend.dto.request.CartItemRequest;
import com.java.backend.dto.response.CartResponse;
import com.java.backend.dto.response.CartItemResponse;
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
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.core.type.TypeReference;

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
            log.info("CartService.processCart userId={}, username={}", user.getUserId(), user.getUsername());
            String cartKey = "cart:" + user.getUserId();
            log.info("CartService.processCart cartKey={}", cartKey);
            
            List<CartItemResponse> cartItems = new ArrayList<>();
            Double totalAmount = 0.0;
            Integer totalItems = 0;
            
            // Process each item in the cart request
            for (CartItemRequest item : request.getItems()) {
                log.info("CartService.processCart processing item: type={}, id={}, quantity={}", 
                    item.getItemType(), item.getItemId(), item.getQuantity());
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
            log.info("CartService.processCart saving to Redis: key={}, items={}", cartKey, cartItems.size());
            baseRedisService.set(cartKey, cartResponse, 60 * 24, TimeUnit.MINUTES); // 24 hours
            
            return cartResponse;
        } catch (Exception e) {
            log.error("Error processing cart: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get cart from Redis
    public CartResponse getCart() {
        try {
            UserEntity user = userService.getCurrentUser();
            if (user == null) {
                log.error("CartService.getCart: User not found");
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            
            log.info("CartService.getCart userId={}, username={}", user.getUserId(), user.getUsername());
            String cartKey = "cart:" + user.getUserId();
            log.info("CartService.getCart cartKey={}", cartKey);
            
            CartResponse cart = baseRedisService.get(cartKey, new TypeReference<CartResponse>() {});
            log.info("CartService.getCart result from Redis: {}", cart != null ? "found" : "not found");
            
            if (cart == null) {
                log.info("CartService.getCart: No cart found for user {}, returning empty cart", user.getUserId());
                return new CartResponse(new ArrayList<>(), 0.0, 0);
            }
            
            // Validate cart data
            if (cart.getItems() == null) {
                log.warn("CartService.getCart: Cart items is null for user {}, returning empty cart", user.getUserId());
                return new CartResponse(new ArrayList<>(), 0.0, 0);
            }
            
            return cart;
        } catch (AppException e) {
            log.error("CartService.getCart: AppException occurred", e);
            throw e;
        } catch (Exception e) {
            log.error("CartService.getCart: Unexpected error occurred", e);
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Clear cart
    public void clearCart() {
        UserEntity user = userService.getCurrentUser();
        String cartKey = "cart:" + user.getUserId();
        baseRedisService.deleteKey(cartKey);
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
            
            if (accessory.getStockQuantity() < item.getQuantity()) {
                throw new AppException(ErrorCode.OUT_OF_STOCK, "Insufficient stock for " + accessory.getAccessoryName());
            }
            
            double subtotal = accessory.getUnitPrice() * item.getQuantity();
            
            return CartItemResponse.builder()
                    .itemType("accessory")
                    .itemId(accessory.getAccessoryId())
                    .name(accessory.getAccessoryName())
                    .thumbnail(accessory.getThumbnail())
                    .price(accessory.getUnitPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();
        }
        
        return null;
    }
}