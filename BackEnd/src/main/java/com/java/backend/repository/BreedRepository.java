package com.java.backend.repository;

import com.java.backend.entity.BreedEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BreedRepository extends JpaRepository<BreedEntity, Long> {
    List<BreedEntity> findByBreedNameContainingIgnoreCase(String name);
}