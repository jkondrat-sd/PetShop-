package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "breeds")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "breed_id")
    private Long id;
    
    @Column(name = "breed_name", nullable = false)
    private String breedName;
    
    @Column(name = "pet_type", nullable = false)
    private String petType;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String status = "active";
}