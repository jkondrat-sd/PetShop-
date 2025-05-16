package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;
    
    @Column(name = "supplier_name", nullable = false)
    private String supplierName;
    
    @Column(name = "contact_name")
    private String contactName;
    
    private String address;
    
    private String phone;
    
    private String email;
}