package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private UserEntity user;
    
    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();
    
    @Column(name = "shipped_date")
    private LocalDateTime shippedDate;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    private Double freight;
    
    @Column(name = "ship_name")
    private String shipName;
    
    @Column(name = "ship_address")
    private String shipAddress;
    
    private String status = "pending"; 
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetailEntity> orderDetails = new ArrayList<>();
}