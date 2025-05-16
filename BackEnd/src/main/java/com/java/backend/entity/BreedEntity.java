package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "breeds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BreedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "breed_id")
    private Long breedId;
    
    @Column(name = "breed_name", nullable = false)
    private String breedName;
    
    private String description;
}