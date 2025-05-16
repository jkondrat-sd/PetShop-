package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "orders")
public class OrderEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;
    
    @Column(nullable = false)
    private String status; // pending/processing/shipped/delivered/cancelled
    
    @Column(nullable = false)
    private String shippingAddress;
    
    @Column(nullable = false)
    private String contactPhone;
    
    private String paymentMethod;
    
    private Double totalAmount;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderDetailEntity> orderDetails = new HashSet<>();
}