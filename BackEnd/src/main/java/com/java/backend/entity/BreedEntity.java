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
@Entity(name = "breeds")
public class BreedEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long breedId;
    
    @Column(nullable = false)
    private String breedName;
    
    @Column(nullable = false)
    private String petType; // dog/cat
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String status; // active/inactive
    
    @OneToMany(mappedBy = "breed", cascade = CascadeType.ALL)
    private Set<PetEntity> pets = new HashSet<>();
}