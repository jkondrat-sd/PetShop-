package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Long petId;
    
    @Column(name = "pet_name", nullable = false)
    private String petName;
    
    @Column(nullable = false)
    private String type; // dog/cat
    
    @ManyToOne
    @JoinColumn(name = "breed_id")
    private BreedEntity breed;
    
    private String gender;
    
    @Column(name = "unit_price")
    private Double unitPrice;
    
    private Integer age;
    
    private String status; // available/sold
    
    private String thumbnail;
    
    @Column(columnDefinition = "TEXT")
    private String images;
}