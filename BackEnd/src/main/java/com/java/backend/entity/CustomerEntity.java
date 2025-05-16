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
@Entity(name = "customers")
public class CustomerEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    private String address;
    private String phone;
    private String email;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<OrderEntity> orders = new HashSet<>();
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<ReviewEntity> reviews = new HashSet<>();
}