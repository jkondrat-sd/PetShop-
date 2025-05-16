package com.java.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private UserEntity user;
    
    @ManyToOne
    @JoinColumn(name = "accessory_id")
    private AccessoryEntity accessory;
    
    @ManyToOne
    @JoinColumn(name = "pet_id")
    private PetEntity pet;
    
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}