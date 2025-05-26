package com.java.backend.repository;

import com.java.backend.entity.AccessoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessoryRepository extends JpaRepository<AccessoryEntity, Long> {
    Page<AccessoryEntity> findByStatus(String status, Pageable pageable);
    Page<AccessoryEntity> findByCategory_IdAndStatus(Long id, String status, Pageable pageable);
    Page<AccessoryEntity> findByAccessoryNameContainingIgnoreCase(String accessoryName, Pageable pageable);
    @Query("SELECT COALESCE(SUM(a.stockQuantity), 0) FROM AccessoryEntity a")
    int sumStock();
}