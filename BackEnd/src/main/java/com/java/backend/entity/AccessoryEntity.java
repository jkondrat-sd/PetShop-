package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accessories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accessories_id")
    private Long accessoryId;
    
    @Column(name = "accessory_name")
    private String accessoryName;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "unit_price")
    private Double unitPrice;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    private String thumbnail;
    
    @Column(columnDefinition = "TEXT")
    private String images;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private SupplierEntity supplier;
    
    private String status = "active";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}