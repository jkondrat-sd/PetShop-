package com.java.backend.service;

import com.java.backend.entity.*;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.dto.request.OrderRequest;
import com.java.backend.dto.request.OrderItemRequest;
import com.java.backend.dto.response.OrderResponse;
import com.java.backend.dto.response.OrderDetailResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AccessoryRepository accessoryRepository;
    private final BaseRedisService baseRedisService;

    // Lấy thông tin người dùng hiện tại
    public UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    // Kiểm tra quyền ADMIN
    private boolean checkRoleAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }

    // Tạo đơn hàng mới
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public OrderResponse createOrder(OrderRequest request) {
        try {
            UserEntity user = getUser();
            
            // Tạo đơn hàng mới
            OrderEntity order = OrderEntity.builder()
                    .user(user)
                    .orderDate(new Date())
                    .shippingAddress(request.getShippingAddress())
                    .contactPhone(request.getContactPhone())
                    .status("pending")
                    .paymentMethod(request.getPaymentMethod())
                    .totalAmount(0.0) // Sẽ được cập nhật sau
                    .build();
            
            OrderEntity savedOrder = orderRepository.save(order);
            
            double totalAmount = 0.0;
            List<OrderDetailResponse> orderDetails = new ArrayList<>();
            
            // Xử lý từng item trong đơn hàng
            for (OrderItemRequest itemRequest : request.getItems()) {
                if ("pet".equals(itemRequest.getType())) {
                    // Xử lý đặt mua thú cưng
                    PetEntity pet = petRepository.findById(itemRequest.getItemId())
                            .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
                    
                    // Kiểm tra pet còn available không
                    if (!"available".equals(pet.getStatus())) {
                        throw new AppException(ErrorCode.PET_NOT_AVAILABLE);
                    }
                    
                    // Thêm vào chi tiết đơn hàng
                    OrderDetailEntity orderDetail = OrderDetailEntity.builder()
                            .order(savedOrder)
                            .pet(pet)
                            .quantity(1) // Thú cưng luôn là số lượng 1
                            .unitPrice(pet.getUnitPrice())
                            .build();
                    
                    OrderDetailEntity savedDetail = orderDetailRepository.save(orderDetail);
                    
                    // Cập nhật trạng thái pet là đã bán
                    pet.setStatus("sold");
                    petRepository.save(pet);
                    
                    // Thêm vào tổng tiền
                    totalAmount += pet.getUnitPrice();
                    
                    // Thêm vào danh sách chi tiết để trả về
                    orderDetails.add(OrderDetailResponse.builder()
                            .orderDetailId(savedDetail.getOrderDetailId())
                            .itemType("pet")
                            .itemName(pet.getPetName())
                            .quantity(1)
                            .unitPrice(pet.getUnitPrice())
                            .build());
                    
                } else if ("accessory".equals(itemRequest.getType())) {
                    // Xử lý đặt mua phụ kiện
                    AccessoryEntity accessory = accessoryRepository.findById(itemRequest.getItemId())
                            .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
                    
                    // Kiểm tra số lượng
                    if (accessory.getStockQuantity() < itemRequest.getQuantity()) {
                        throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                    }
                    
                    // Thêm vào chi tiết đơn hàng
                    OrderDetailEntity orderDetail = OrderDetailEntity.builder()
                            .order(savedOrder)
                            .accessory(accessory)
                            .quantity(itemRequest.getQuantity())
                            .unitPrice(accessory.getUnitPrice())
                            .build();
                    
                    OrderDetailEntity savedDetail = orderDetailRepository.save(orderDetail);
                    
                    // Cập nhật số lượng tồn kho
                    accessory.setStockQuantity(accessory.getStockQuantity() - itemRequest.getQuantity());
                    accessoryRepository.save(accessory);
                    
                    // Thêm vào tổng tiền
                    totalAmount += accessory.getUnitPrice() * itemRequest.getQuantity();
                    
                    // Thêm vào danh sách chi tiết để trả về
                    orderDetails.add(OrderDetailResponse.builder()
                            .orderDetailId(savedDetail.getOrderDetailId())
                            .itemType("accessory")
                            .itemName(accessory.getAccessoryName())
                            .quantity(itemRequest.getQuantity())
                            .unitPrice(accessory.getUnitPrice())
                            .build());
                }
            }
            
            // Cập nhật tổng tiền
            savedOrder.setTotalAmount(totalAmount);
            orderRepository.save(savedOrder);
            
            // Clear cache
            baseRedisService.deleteKeys("orders_*");
            baseRedisService.deleteKeys("user_orders_*");
            
            // Trả về thông tin đơn hàng
            return OrderResponse.builder()
                    .orderId(savedOrder.getOrderId())
                    .username(user.getUsername())
                    .orderDate(savedOrder.getOrderDate())
                    .status(savedOrder.getStatus())
                    .shippingAddress(savedOrder.getShippingAddress())
                    .contactPhone(savedOrder.getContactPhone())
                    .paymentMethod(savedOrder.getPaymentMethod())
                    .totalAmount(totalAmount)
                    .orderDetails(orderDetails)
                    .build();
            
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating order: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy danh sách đơn hàng của người dùng hiện tại
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Pagination<OrderResponse> getUserOrders(int page, int size) {
        UserEntity user = getUser();
        String cacheKey = "user_orders_" + user.getUserId() + "_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<OrderResponse>) cachedResult;
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderEntity> orderPage = orderRepository.findByUserId(user.getUserId(), pageable);
            
            List<OrderResponse> orders = orderPage.getContent().stream()
                    .map(this::convertToOrderResponse)
                    .collect(Collectors.toList());
            
            Pagination<OrderResponse> pagination = new Pagination<>();
            pagination.setContent(orders);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(orderPage.getTotalElements());
            pagination.setTotalPages(orderPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (Exception e) {
            log.error("Error getting user orders: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy tất cả đơn hàng (cho admin)
    @PreAuthorize("hasRole('ADMIN')")
    public Pagination<OrderResponse> getAllOrders(int page, int size, String status) {
        String cacheKey = "orders_" + page + "_" + size + "_" + status;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<OrderResponse>) cachedResult;
        }
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderEntity> orderPage;
            
            if (status != null && !status.isEmpty()) {
                orderPage = orderRepository.findByStatus(status, pageable);
            } else {
                orderPage = orderRepository.findAll(pageable);
            }
            
            List<OrderResponse> orders = orderPage.getContent().stream()
                    .map(this::convertToOrderResponse)
                    .collect(Collectors.toList());
            
            Pagination<OrderResponse> pagination = new Pagination<>();
            pagination.setContent(orders);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(orderPage.getTotalElements());
            pagination.setTotalPages(orderPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (Exception e) {
            log.error("Error getting all orders: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy thông tin chi tiết đơn hàng
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public OrderResponse getOrderById(Long orderId) {
        String cacheKey = "order_" + orderId;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof OrderResponse) {
            return (OrderResponse) cachedResult;
        }
        
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        // Kiểm tra quyền truy cập đơn hàng
        UserEntity user = getUser();
        if (!checkRoleAdmin() && !order.getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        OrderResponse response = convertToOrderResponse(order);
        
        // Lưu vào cache
        baseRedisService.setObjectForMinutes(cacheKey, response, 30);
        
        return response;
    }

    // Cập nhật trạng thái đơn hàng
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        order.setStatus(status);
        OrderEntity updatedOrder = orderRepository.save(order);
        
        // Clear cache
        baseRedisService.deleteKey("order_" + orderId);
        baseRedisService.deleteKeys("orders_*");
        baseRedisService.deleteKeys("user_orders_*");
        
        return convertToOrderResponse(updatedOrder);
    }

    // Hủy đơn hàng
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public OrderResponse cancelOrder(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        // Kiểm tra quyền hủy đơn hàng
        UserEntity user = getUser();
        if (!checkRoleAdmin() && !order.getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        // Kiểm tra trạng thái đơn hàng có thể hủy không
        if (!"pending".equals(order.getStatus()) && !"processing".equals(order.getStatus())) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }
        
        // Hoàn trả sản phẩm
        List<OrderDetailEntity> orderDetails = orderDetailRepository.findByOrderId(orderId);
        for (OrderDetailEntity detail : orderDetails) {
            if (detail.getPet() != null) {
                // Hoàn trả pet về trạng thái available
                PetEntity pet = detail.getPet();
                pet.setStatus("available");
                petRepository.save(pet);
            }
            
            if (detail.getAccessory() != null) {
                // Hoàn trả số lượng accessory vào kho
                AccessoryEntity accessory = detail.getAccessory();
                accessory.setStockQuantity(accessory.getStockQuantity() + detail.getQuantity());
                accessoryRepository.save(accessory);
            }
        }
        
        // Cập nhật trạng thái đơn hàng
        order.setStatus("cancelled");
        OrderEntity updatedOrder = orderRepository.save(order);
        
        // Clear cache
        baseRedisService.deleteKey("order_" + orderId);
        baseRedisService.deleteKeys("orders_*");
        baseRedisService.deleteKeys("user_orders_*");
        
        return convertToOrderResponse(updatedOrder);
    }

    // Chuyển đổi từ entity sang response
    private OrderResponse convertToOrderResponse(OrderEntity order) {
        List<OrderDetailEntity> details = orderDetailRepository.findByOrderId(order.getOrderId());
        
        List<OrderDetailResponse> detailResponses = details.stream()
                .map(detail -> {
                    String itemType = detail.getPet() != null ? "pet" : "accessory";
                    String itemName = detail.getPet() != null ? 
                            detail.getPet().getPetName() : detail.getAccessory().getAccessoryName();
                    
                    return OrderDetailResponse.builder()
                            .orderDetailId(detail.getOrderDetailId())
                            .itemType(itemType)
                            .itemName(itemName)
                            .quantity(detail.getQuantity())
                            .unitPrice(detail.getUnitPrice())
                            .build();
                })
                .collect(Collectors.toList());
        
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .username(order.getUser().getUsername())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .contactPhone(order.getContactPhone())
                .paymentMethod(order.getPaymentMethod())
                .totalAmount(order.getTotalAmount())
                .orderDetails(detailResponses)
                .build();
    }
}