package com.java.backend.service;

import com.java.backend.dto.request.ReviewRequest;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.ReviewResponse;
import com.java.backend.entity.AccessoryEntity;
import com.java.backend.entity.PetEntity;
import com.java.backend.entity.ReviewEntity;
import com.java.backend.entity.UserEntity;
import com.java.backend.exception.AppException;
import com.java.backend.exception.ErrorCode;
import com.java.backend.repository.AccessoryRepository;
import com.java.backend.repository.PetRepository;
import com.java.backend.repository.ReviewRepository;
import com.java.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final PetRepository petRepository;
    private final AccessoryRepository accessoryRepository;
    private final UserRepository userRepository;
    private final BaseRedisService baseRedisService;

    // Lấy thông tin người dùng hiện tại
    public UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    // Tạo đánh giá cho pet
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ReviewResponse addPetReview(Long petId, ReviewRequest request) {
        UserEntity user = getUser();
        PetEntity pet = petRepository.findById(petId)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));
        
        // Kiểm tra xem người dùng đã đánh giá pet này chưa
        if (reviewRepository.findByUserIdAndPetId(user.getUserId(), petId).isPresent()) {
            throw new AppException(ErrorCode.ALREADY_REVIEWED);
        }
        
        ReviewEntity review = ReviewEntity.builder()
                .user(user)
                .pet(pet)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        
        ReviewEntity savedReview = reviewRepository.save(review);
        
        // Clear cache
        baseRedisService.deleteKeys("pet_reviews_*");
        baseRedisService.deleteKey("pet_" + petId);
        
        return convertToReviewResponse(savedReview);
    }
    
    // Tạo đánh giá cho accessory
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ReviewResponse addAccessoryReview(Long accessoryId, ReviewRequest request) {
        UserEntity user = getUser();
        AccessoryEntity accessory = accessoryRepository.findById(accessoryId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCESSORY_NOT_FOUND));
        
        // Kiểm tra xem người dùng đã đánh giá accessory này chưa
        if (reviewRepository.findByUserIdAndAccessoryId(user.getUserId(), accessoryId).isPresent()) {
            throw new AppException(ErrorCode.ALREADY_REVIEWED);
        }
        
        ReviewEntity review = ReviewEntity.builder()
                .user(user)
                .accessory(accessory)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        
        ReviewEntity savedReview = reviewRepository.save(review);
        
        // Clear cache
        baseRedisService.deleteKeys("accessory_reviews_*");
        baseRedisService.deleteKey("accessory_" + accessoryId);
        
        return convertToReviewResponse(savedReview);
    }
    
    // Lấy danh sách đánh giá của một pet
    public Pagination<ReviewResponse> getPetReviews(Long petId, int page, int size) {
        String cacheKey = "pet_reviews_" + petId + "_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<ReviewResponse>) cachedResult;
        }
        
        try {
            // Kiểm tra pet tồn tại
            if (!petRepository.existsById(petId)) {
                throw new AppException(ErrorCode.PET_NOT_FOUND);
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<ReviewEntity> reviewPage = reviewRepository.findByPetId(petId, pageable);
            
            List<ReviewResponse> reviews = reviewPage.getContent().stream()
                    .map(this::convertToReviewResponse)
                    .collect(Collectors.toList());
            
            Pagination<ReviewResponse> pagination = new Pagination<>();
            pagination.setContent(reviews);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(reviewPage.getTotalElements());
            pagination.setTotalPages(reviewPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting pet reviews: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Lấy danh sách đánh giá của một accessory
    public Pagination<ReviewResponse> getAccessoryReviews(Long accessoryId, int page, int size) {
        String cacheKey = "accessory_reviews_" + accessoryId + "_" + page + "_" + size;
        
        // Kiểm tra cache
        Object cachedResult = baseRedisService.get(cacheKey);
        if (cachedResult instanceof Pagination) {
            return (Pagination<ReviewResponse>) cachedResult;
        }
        
        try {
            // Kiểm tra accessory tồn tại
            if (!accessoryRepository.existsById(accessoryId)) {
                throw new AppException(ErrorCode.ACCESSORY_NOT_FOUND);
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<ReviewEntity> reviewPage = reviewRepository.findByAccessoryId(accessoryId, pageable);
            
            List<ReviewResponse> reviews = reviewPage.getContent().stream()
                    .map(this::convertToReviewResponse)
                    .collect(Collectors.toList());
            
            Pagination<ReviewResponse> pagination = new Pagination<>();
            pagination.setContent(reviews);
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotalElements(reviewPage.getTotalElements());
            pagination.setTotalPages(reviewPage.getTotalPages());
            
            // Lưu vào cache
            baseRedisService.setObjectForMinutes(cacheKey, pagination, 10);
            
            return pagination;
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting accessory reviews: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Xóa đánh giá
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public void deleteReview(Long reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        UserEntity user = getUser();
        
        // Chỉ admin hoặc chính người tạo đánh giá mới có thể xóa
        if (!user.getRole().equals("ROLE_ADMIN") && !review.getUser().getUserId().equals(user.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        reviewRepository.delete(review);
        
        // Clear cache
        if (review.getPet() != null) {
            baseRedisService.deleteKeys("pet_reviews_*");
            baseRedisService.deleteKey("pet_" + review.getPet().getPetId());
        }
        
        if (review.getAccessory() != null) {
            baseRedisService.deleteKeys("accessory_reviews_*");
            baseRedisService.deleteKey("accessory_" + review.getAccessory().getAccessoryId());
        }
    }
    
    private ReviewResponse convertToReviewResponse(ReviewEntity review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .username(review.getUser().getUsername())
                .userAvatar(review.getUser().getAvatar())
                .rating(review.getRating())
                .comment(review.getComment())
                .petId(review.getPet() != null ? review.getPet().getPetId() : null)
                .accessoryId(review.getAccessory() != null ? review.getAccessory().getAccessoryId() : null)
                .createdAt(review.getCreatedAt())
                .build();
    }
}