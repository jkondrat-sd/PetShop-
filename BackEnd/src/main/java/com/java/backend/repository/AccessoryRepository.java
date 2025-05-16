package com.java.backend.repository;

import com.java.backend.entity.AccessoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessoryRepository extends JpaRepository<AccessoryEntity, Long> {
    
    Page<AccessoryEntity> findByStatus(String status, Pageable pageable);
    
    Page<AccessoryEntity> findByCategoryIdAndStatus(Long categoryId, String status, Pageable pageable);
}