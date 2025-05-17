package com.java.backend.repository;

import com.java.backend.entity.BreedEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BreedRepository extends JpaRepository<BreedEntity, Long> {
    Page<BreedEntity> findByStatus(String status, Pageable pageable);
    List<BreedEntity> findByPetType(String petType);
    boolean existsByBreedName(String breedName);
}