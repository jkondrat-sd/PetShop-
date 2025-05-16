// filepath: c:\Users\Window 11\Desktop\C++28tech\Front-End\LT_Web\BackEnd\src\main\java\com\java\backend\entity\PetEntity.java
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
@Entity(name = "pets")
public class PetEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petId;
    
    @Column(nullable = false)
    private String petName;
    
    @Column(nullable = false)
    private String type; // dog/cat
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id")
    private BreedEntity breed;
    
    private String gender;
    private Double unitPrice;
    private Integer age;
    
    @Column(nullable = false)
    private String status; // available/sold
    
    private String thumbnail;
    
    @Column(columnDefinition = "TEXT")
    private String images;
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private Set<OrderDetailEntity> orderDetails = new HashSet<>();
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private Set<ReviewEntity> reviews = new HashSet<>();
}