package com.java.backend.repository;

import com.java.backend.entity.CategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findByCategoryNameContainingIgnoreCase(String categoryName);
    Page<CategoryEntity> findByStatus(String status, Pageable pageable);
    boolean existsByCategoryName(String categoryName);
}