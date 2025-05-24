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
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final UserService userService;
    private final PetRepository petRepository;
    private final AccessoryRepository accessoryRepository;
    private final BaseRedisService baseRedisService;

    public CartResponse processCart(CartRequest request) {
      try {
          UserEntity user = userService.getCurrentUser();
          String cartKey = "cart:" + user.getUserId();
          log.info("Processing cart for user ID: {}, cartKey: {}", user.getUserId(), cartKey);
          
          // Lấy giỏ hàng hiện tại
          CartResponse currentCart = null;
          try {
              currentCart = baseRedisService.get(cartKey, CartResponse.class);
              log.info("Current cart from Redis: {}", currentCart != null ? 
                     (currentCart.getItems() != null ? currentCart.getItems().size() + " items" : "null items") 
                     : "null");
          } catch (Exception e) {
              log.error("Error getting cart from Redis", e);
          }
          
          if (currentCart == null) {
              log.info("Creating new cart");
              currentCart = new CartResponse(new ArrayList<>(), 0.0, 0);
          }
          
          // Đảm bảo items không null
          if (currentCart.getItems() == null) {
              currentCart.setItems(new ArrayList<>());
          }
          
          // Xử lý items từ request
          if (request.getItems() != null && !request.getItems().isEmpty()) {
              for (CartItemRequest itemRequest : request.getItems()) {
                  log.info("Processing item: type={}, id={}, quantity={}", 
                           itemRequest.getItemType(), itemRequest.getItemId(), itemRequest.getQuantity());
                  
                  // Tìm item trong giỏ hiện tại
                  CartItemResponse existingItem = null;
                  for (CartItemResponse item : currentCart.getItems()) {
                      if (itemRequest.getItemType().equalsIgnoreCase(item.getItemType()) &&
                          itemRequest.getItemId().equals(item.getItemId())) {
                          existingItem = item;
                          break;
                      }
                  }
                  
                  // Xử lý theo quantity
                  if (itemRequest.getQuantity() <= 0) {
                      // Xóa item
                      if (existingItem != null) {
                          currentCart.getItems().remove(existingItem);
                          log.info("Removed item from cart: {}", existingItem.getName());
                      }
                  } else if (existingItem != null) {
                      // Cập nhật số lượng
                      if ("accessory".equalsIgnoreCase(itemRequest.getItemType())) {
                          existingItem.setQuantity(itemRequest.getQuantity());
                          existingItem.setSubtotal(existingItem.getPrice() * itemRequest.getQuantity());
                          log.info("Updated item quantity: {} = {}", existingItem.getName(), existingItem.getQuantity());
                      }
                  } else {
                      // Thêm item mới
                      CartItemResponse newItem = createCartItem(itemRequest);
                      if (newItem != null) {
                          currentCart.getItems().add(newItem);
                          log.info("Added new item to cart: {}", newItem.getName());
                      }
                  }
              }
          }
          
          // Tính lại tổng
          double totalAmount = 0.0;
          int totalItems = 0;
          for (CartItemResponse item : currentCart.getItems()) {
              totalAmount += item.getSubtotal();
              totalItems += item.getQuantity();
          }
          currentCart.setTotalAmount(totalAmount);
          currentCart.setTotalItems(totalItems);
          
          // Lưu giỏ hàng
          log.info("Saving cart to Redis: {} items, total: {}", 
                  currentCart.getItems().size(), currentCart.getTotalAmount());
          
          // In ra từng item trong giỏ hàng (để debug)
          for (CartItemResponse item : currentCart.getItems()) {
              log.info("Item in cart: type={}, id={}, name={}, price={}, quantity={}, subtotal={}",
                      item.getItemType(), item.getItemId(), item.getName(), 
                      item.getPrice(), item.getQuantity(), item.getSubtotal());
          }
          
          baseRedisService.set(cartKey, currentCart, 24 * 60, TimeUnit.MINUTES);
          
          // Kiểm tra lưu trữ thành công
          CartResponse savedCart = baseRedisService.get(cartKey, CartResponse.class);
          if (savedCart != null) {
              log.info("Verified cart saved in Redis: {} items", 
                      savedCart.getItems() != null ? savedCart.getItems().size() : 0);
          } else {
              log.error("Failed to save cart to Redis");
          }
          
          return currentCart;
      } catch (Exception e) {
          log.error("Error processing cart", e);
          throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
      }
  }
    
    // Sửa lại phương thức getCart
    public CartResponse getCart() {
        try {
            UserEntity user = userService.getCurrentUser();
            log.info("Getting cart for user ID: {}, username: {}", user.getUserId(), user.getUsername());
            
            String cartKey = "cart:" + user.getUserId();
            
            // QUAN TRỌNG: Luôn sử dụng Class<T> chứ không dùng TypeReference<T>
            CartResponse cart = baseRedisService.get(cartKey, CartResponse.class);
            
            if (cart == null) {
                log.info("No cart found in Redis for user {}", user.getUserId());
                return new CartResponse(new ArrayList<>(), 0.0, 0);
            }
            
            log.info("Retrieved cart from Redis: {} items, total: {}", 
                cart.getItems() != null ? cart.getItems().size() : 0, 
                cart.getTotalAmount());
            
            // Đảm bảo các trường không null
            if (cart.getItems() == null) {
                cart.setItems(new ArrayList<>());
            }
            
            return cart;
            
        } catch (Exception e) {
            log.error("Error getting cart", e);
            return new CartResponse(new ArrayList<>(), 0.0, 0);
        }
    }
    
    // Sửa lại phương thức clearCart
    public void clearCart() {
        try {
            UserEntity user = userService.getCurrentUser();
            String cartKey = "cart:" + user.getUserId();
            
            baseRedisService.deleteKey(cartKey);
            log.info("Cleared cart for user ID: {}", user.getUserId());
            
        } catch (Exception e) {
            log.error("Error clearing cart", e);
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Phương thức trợ giúp để tạo CartItemResponse từ CartItemRequest
    private CartItemResponse createCartItem(CartItemRequest request) {
      try {
          log.info("Creating cart item with type={}, id={}, quantity={}", 
                  request.getItemType(), request.getItemId(), request.getQuantity());
          
          if ("pet".equalsIgnoreCase(request.getItemType())) {
              PetEntity pet = petRepository.findById(request.getItemId())
                  .orElseThrow(() -> {
                      log.error("Pet not found with ID: {}", request.getItemId());
                      return new AppException(ErrorCode.PET_NOT_FOUND);
                  });
              
              CartItemResponse item = CartItemResponse.builder()
                  .itemId(pet.getPetId())
                  .itemType("pet")
                  .name(pet.getPetName())
                  .price(pet.getUnitPrice())
                  .quantity(1) // Pet luôn có số lượng 1
                  .subtotal(pet.getUnitPrice())
                  .thumbnail(pet.getThumbnail())
                  .build();
                  
              log.info("Created pet cart item: {}", item.getName());
              return item;
              
          } else if ("accessory".equalsIgnoreCase(request.getItemType())) {
              AccessoryEntity accessory = accessoryRepository.findById(request.getItemId())
                  .orElseThrow(() -> {
                      log.error("Accessory not found with ID: {}", request.getItemId());
                      return new AppException(ErrorCode.ACCESSORY_NOT_FOUND);
                  });
              
              CartItemResponse item = CartItemResponse.builder()
                  .itemId(accessory.getAccessoryId())
                  .itemType("accessory")
                  .name(accessory.getAccessoryName())
                  .price(accessory.getUnitPrice())
                  .quantity(request.getQuantity())
                  .subtotal(accessory.getUnitPrice() * request.getQuantity())
                  .thumbnail(accessory.getThumbnail())
                  .build();
                  
              log.info("Created accessory cart item: {}", item.getName());
              return item;
          } else {
              log.warn("Invalid item type: {}", request.getItemType());
              throw new AppException(ErrorCode.BAD_REQUEST);
          }
      } catch (AppException e) {
          throw e; // Rethrow AppException
      } catch (Exception e) {
          log.error("Unexpected error creating cart item", e);
          throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
      }
  }
}