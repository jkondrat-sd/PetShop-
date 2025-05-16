package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "accessories")
public class AccessoryEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accessoryId;
    
    @Column(nullable = false)
    private String accessoryName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
    
    private Double unitPrice;
    
    private Integer stockQuantity;
    
    @Column(nullable = false)
    private String status; // active/inactive
    
    private String thumbnail;
    
    @Column(columnDefinition = "TEXT")
    private String images;
    
    @OneToMany(mappedBy = "accessory", cascade = CascadeType.ALL)
    private Set<OrderDetailEntity> orderDetails = new HashSet<>();
    
    @OneToMany(mappedBy = "accessory", cascade = CascadeType.ALL)
    private Set<ReviewEntity> reviews = new HashSet<>();
}