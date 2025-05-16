package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_detail_id")
    private Long orderDetailId;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;
    
    private String itemType; // pet/accessory
    
    @ManyToOne
    @JoinColumn(name = "pet_id")
    private PetEntity pet;
    
    @ManyToOne
    @JoinColumn(name = "accessory_id")
    private AccessoryEntity accessory;
    
    private Integer quantity;
    
    @Column(name = "unit_price")
    private Double unitPrice;
    
    private Double discount;
}