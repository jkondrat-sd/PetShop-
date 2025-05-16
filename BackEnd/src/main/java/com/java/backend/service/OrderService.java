package com.java.backend.service;

import com.java.backend.dto.request.OrderRequest;
import com.java.backend.dto.response.OrderResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.entity.AccessoryEntity;
import com.java.backend.entity.OrderDetailEntity;
import com.java.backend.entity.OrderEntity;
import com.java.backend.entity.PetEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartService cartService;
    private final InventoryService inventoryService;
    private final EmailService emailService;
    
    public OrderResponse createOrder(OrderRequest orderRequest) {
        UserEntity currentUser = userService.getCurrentUser();
        
        // Lấy giỏ hàng từ Redis
        CartResponse cartResponse = cartService.getCart();
        if (cartResponse.getItems().isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Cart is empty");
        }
        
        // Tạo đơn hàng mới
        OrderEntity order = new OrderEntity();
        order.setUser(currentUser);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(cartResponse.getTotalAmount());
        order.setFreight(orderRequest.getFreight());
        order.setShipName(orderRequest.getShipName());
        order.setShipAddress(orderRequest.getShipAddress());
        order.setStatus("pending");
        
        // Tạo chi tiết đơn hàng
        List<OrderDetailEntity> orderDetails = new ArrayList<>();
        
        for (CartItemResponse cartItem : cartResponse.getItems()) {
            // Kiểm tra và cập nhật tồn kho
            boolean inventoryUpdated = inventoryService.checkAndUpdateInventory(
                    cartItem.getItemType(),
                    cartItem.getItemId(),
                    cartItem.getQuantity()
            );
            
            if (!inventoryUpdated) {
                throw new AppException(ErrorCode.OUT_OF_STOCK, "Some items are out of stock");
            }
            
            OrderDetailEntity orderDetail = new OrderDetailEntity();
            orderDetail.setOrder(order);
            orderDetail.setItemType(cartItem.getItemType());
            
            if ("pet".equals(cartItem.getItemType())) {
                orderDetail.setPet(new PetEntity());
                orderDetail.getPet().setPetId(cartItem.getItemId());
            } else if ("accessory".equals(cartItem.getItemType())) {
                orderDetail.setAccessory(new AccessoryEntity());
                orderDetail.getAccessory().setAccessoryId(cartItem.getItemId());
            }
            
            orderDetail.setQuantity(cartItem.getQuantity());
            orderDetail.setUnitPrice(cartItem.getPrice());
            orderDetail.setDiscount(0.0); // Có thể áp dụng giảm giá nếu cần
            
            orderDetails.add(orderDetail);
        }
        
        order.setOrderDetails(orderDetails);
        OrderEntity savedOrder = orderRepository.save(order);
        
        // Xóa giỏ hàng
        cartService.clearCart();
        
        // Gửi email xác nhận
        emailService.sendOrderConfirmation(savedOrder.getOrderId());
        
        return mapOrderToResponse(savedOrder);
    }
    
    public Pagination<OrderResponse> getUserOrders(int page, int size) {
        UserEntity currentUser = userService.getCurrentUser();
        Page<OrderEntity> orderPage = orderRepository.findByUserId(currentUser.getUserId(), PageRequest.of(page, size));
        
        List<OrderResponse> orders = orderPage.getContent()
                .stream()
                .map(this::mapOrderToResponse)
                .collect(Collectors.toList());
        
        Pagination<OrderResponse> pagination = new Pagination<>();
        pagination.setContent(orders);
        pagination.setPage(page);
        pagination.setSize(size);
        pagination.setTotalElements(orderPage.getTotalElements());
        pagination.setTotalPages(orderPage.getTotalPages());
        
        return pagination;
    }
    
    public OrderResponse getOrderById(Long id) {
        UserEntity currentUser = userService.getCurrentUser();
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        // Đảm bảo người dùng chỉ có thể xem đơn hàng của họ (trừ khi là admin)
        if (!order.getUser().getUserId().equals(currentUser.getUserId()) &&
                !"ROLE_ADMIN".equals(currentUser.getRole().getName())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        return mapOrderToResponse(order);
    }
    
    public void cancelOrder(Long id) {
        UserEntity currentUser = userService.getCurrentUser();
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        // Đảm bảo người dùng chỉ có thể hủy đơn hàng của họ (trừ khi là admin)
        if (!order.getUser().getUserId().equals(currentUser.getUserId()) &&
                !"ROLE_ADMIN".equals(currentUser.getRole().getName())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        // Chỉ có thể hủy đơn hàng với trạng thái "pending"
        if (!"pending".equals(order.getStatus())) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS, "Only pending orders can be cancelled");
        }
        
        // Cập nhật trạng thái
        order.setStatus("cancelled");
        orderRepository.save(order);
        
        // Hoàn trả lại số lượng tồn kho
        for (OrderDetailEntity orderDetail : order.getOrderDetails()) {
            inventoryService.restoreInventory(
                    orderDetail.getItemType(),
                    orderDetail.getItemType().equals("pet") ? orderDetail.getPet().getPetId() : orderDetail.getAccessory().getAccessoryId(),
                    orderDetail.getQuantity()
            );
        }
    }
    
    public Pagination<OrderResponse> getAllOrders(String status, int page, int size) {
        Page<OrderEntity> orderPage;
        
        if (status != null && !status.isEmpty()) {
            orderPage = orderRepository.findByStatus(status, PageRequest.of(page, size));
        } else {
            orderPage = orderRepository.findAll(PageRequest.of(page, size));
        }
        
        List<OrderResponse> orders = orderPage.getContent()
                .stream()
                .map(this::mapOrderToResponse)
                .collect(Collectors.toList());
        
        Pagination<OrderResponse> pagination = new Pagination<>();
        pagination.setContent(orders);
        pagination.setPage(page);
        pagination.setSize(size);
        pagination.setTotalElements(orderPage.getTotalElements());
        pagination.setTotalPages(orderPage.getTotalPages());
        
        return pagination;
    }
    
    public OrderResponse updateOrderStatus(Long id, String status) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        // Kiểm tra trạng thái hợp lệ
        validateOrderStatus(status);
        
        // Cập nhật trạng thái
        order.setStatus(status);
        
        // Nếu đơn hàng được giao, cập nhật ngày giao hàng
        if ("shipped".equals(status)) {
            order.setShippedDate(LocalDateTime.now());
            emailService.sendShippingNotification(order.getOrderId());
        }
        
        OrderEntity updatedOrder = orderRepository.save(order);
        return mapOrderToResponse(updatedOrder);
    }
    
    private void validateOrderStatus(String status) {
        List<String> validStatuses = List.of("pending", "paid", "processing", "shipped", "delivered", "cancelled");
        if (!validStatuses.contains(status)) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS, "Invalid order status");
        }
    }
    
    private OrderResponse mapOrderToResponse(OrderEntity order) {
        // Implement mapping logic from OrderEntity to OrderResponse
        // This is a simplification
        return OrderResponse.builder()
                .id(order.getOrderId())
                .userId(order.getUser().getUserId())
                .userName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .orderDate(order.getOrderDate())
                .shippedDate(order.getShippedDate())
                .totalAmount(order.getTotalAmount())
                .freight(order.getFreight())
                .shipName(order.getShipName())
                .shipAddress(order.getShipAddress())
                .status(order.getStatus())
                // Map order details
                .orderDetails(order.getOrderDetails().stream()
                        .map(this::mapOrderDetailToResponse)
                        .collect(Collectors.toList()))
                .build();
    }
    
    private OrderDetailResponse mapOrderDetailToResponse(OrderDetailEntity orderDetail) {
        // Implement mapping logic
        return null; // Simplified
    }
}