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
@Entity(name = "users")
public class UserEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String fullName;
    
    private String phoneNumber;
    
    private String address;
    
    private String avatar;
    
    @Column(nullable = false)
    private String role; // ROLE_USER, ROLE_ADMIN
    
    @Column(nullable = false)
    private boolean enabled;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<OrderEntity> orders = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<ReviewEntity> reviews = new HashSet<>();
}