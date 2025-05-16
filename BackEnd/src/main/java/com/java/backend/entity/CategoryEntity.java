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
@Entity(name = "categories")
public class CategoryEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;
    
    @Column(nullable = false)
    private String categoryName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String status; // active/inactive
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private Set<AccessoryEntity> accessories = new HashSet<>();
}