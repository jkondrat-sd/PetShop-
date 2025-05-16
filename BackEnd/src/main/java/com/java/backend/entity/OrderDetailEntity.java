package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "order_details")
public class OrderDetailEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private PetEntity pet;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accessory_id")
    private AccessoryEntity accessory;
    
    private Integer quantity;
    
    private Double unitPrice;
}