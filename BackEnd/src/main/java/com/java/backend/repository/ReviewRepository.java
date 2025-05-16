// filepath: c:\Users\Window 11\Desktop\C++28tech\Front-End\LT_Web\BackEnd\src\main\java\com\java\backend\repository\ReviewRepository.java
package com.java.backend.repository;

import com.java.backend.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    
    Page<ReviewEntity> findByPetId(Long petId, Pageable pageable);
    
    Page<ReviewEntity> findByAccessoryId(Long accessoryId, Pageable pageable);
    
    Page<ReviewEntity> findByUserId(Long userId, Pageable pageable);
    
    Optional<ReviewEntity> findByUserIdAndPetId(Long userId, Long petId);
    
    Optional<ReviewEntity> findByUserIdAndAccessoryId(Long userId, Long accessoryId);
}