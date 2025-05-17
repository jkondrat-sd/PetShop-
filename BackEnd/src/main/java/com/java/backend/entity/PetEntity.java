package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}