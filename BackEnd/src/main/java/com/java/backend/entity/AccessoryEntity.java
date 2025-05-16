package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accessories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccessoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accessories_id")
    private Long accessoryId;
    
    private String name;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "unit_price")
    private Double unitPrice;
    
    private Integer stock;
    
    private String thumbnail;
    
    @Column(columnDefinition = "TEXT")
    private String images;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private SupplierEntity supplier;
    
    private String status = "active";
}