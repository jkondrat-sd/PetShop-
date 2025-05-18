package com.java.backend.repository;

import com.java.backend.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    ReviewEntity findByUserIdAndPetId(Long userId, Long petId);
    ReviewEntity findByUserIdAndAccessoryId(Long userId, Long accessoryId);
    Page<ReviewEntity> findByPetId(Long petId, Pageable pageable);
    Page<ReviewEntity> findByAccessoryId(Long accessoryId, Pageable pageable);
}