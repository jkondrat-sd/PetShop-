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
@Entity(name = "suppliers")
public class SupplierEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;
    
    @Column(nullable = false)
    private String supplierName;
    
    private String contactName;
    private String address;
    private String phone;
    private String email;
    
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private Set<AccessoryEntity> accessories = new HashSet<>();
}