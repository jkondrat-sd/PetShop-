package com.java.backend.repository;

import com.java.backend.entity.PetEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Long> {
    Page<PetEntity> findByStatus(String status, Pageable pageable);
    Page<PetEntity> findByTypeAndStatus(String type, String status, Pageable pageable);
    Page<PetEntity> findByTypeAndBreed_IdAndStatus(String type, Long breedId, String status, Pageable pageable);
    Page<PetEntity> findByBreed_IdAndStatus(Long breedId, String status, Pageable pageable);
}