package com.java.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.java.backend.dto.request.ReviewRequest;
import com.java.backend.dto.response.ReviewResponse;
import com.java.backend.dto.response.Pagination;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
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

    private static final int MAX_COMMENT_LENGTH = 1000;
    private static final int MIN_RATING = 1;
    private static final int MAX_RATING = 5;

    // Lấy thông tin người dùng hiện tại
    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private void validateReviewRequest(ReviewRequest request) {
        // Validate rating
        if (request.getRating() == null || request.getRating() < MIN_RATING || request.getRating() > MAX_RATING) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Rating must be between " + MIN_RATING + " and " + MAX_RATING);
        }

        // Validate comment length
        if (request.getComment() != null && request.getComment().length() > MAX_COMMENT_LENGTH) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Comment must not exceed " + MAX_COMMENT_LENGTH + " characters");
        }

        // Validate item existence
        if (request.getPetId() != null) {
            if (!petRepository.existsById(request.getPetId())) {
                throw new AppException(ErrorCode.PET_NOT_FOUND);
            }
        } else if (request.getAccessoryId() != null) {
            if (!accessoryRepository.existsById(request.getAccessoryId())) {
                throw new AppException(ErrorCode.ACCESSORY_NOT_FOUND);
            }
        } else {
            throw new AppException(ErrorCode.BAD_REQUEST, "Either petId or accessoryId must be provided");
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ReviewResponse createReview(ReviewRequest request) {
        UserEntity currentUser = getCurrentUser();
        request.setUserId(currentUser.getUserId());

        validateReviewRequest(request);

        // Check if user has already reviewed this item
        if (request.getPetId() != null) {
            ReviewEntity existingReview = reviewRepository.findByUser_UserIdAndPet_PetId(request.getUserId(), request.getPetId());
            if (existingReview != null) {
                throw new AppException(ErrorCode.ALREADY_REVIEWED);
            }
        } else if (request.getAccessoryId() != null) {
            ReviewEntity existingReview = reviewRepository.findByUser_UserIdAndAccessory_AccessoryId(request.getUserId(), request.getAccessoryId());
            if (existingReview != null) {
                throw new AppException(ErrorCode.ALREADY_REVIEWED);
            }
        }

        ReviewEntity review = ReviewEntity.builder()
                .userId(request.getUserId())
                .petId(request.getPetId())
                .accessoryId(request.getAccessoryId())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ReviewEntity savedReview = reviewRepository.save(review);
        
        // Clear cache
        if (review.getPetId() != null) {
            baseRedisService.deleteKeys("reviews:pet:*");
        }
        if (review.getAccessoryId() != null) {
            baseRedisService.deleteKeys("reviews:accessory:*");
        }
        
        return mapToResponse(savedReview);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ReviewResponse updateReview(Long id, ReviewRequest request) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        UserEntity currentUser = getCurrentUser();
        
        // Chỉ admin hoặc chính người tạo đánh giá mới có thể cập nhật
        if (!currentUser.getRole().getName().equals("ROLE_ADMIN") && !review.getUserId().equals(currentUser.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        validateReviewRequest(request);

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        ReviewEntity updatedReview = reviewRepository.save(review);
        
        // Clear cache
        if (review.getPetId() != null) {
            baseRedisService.deleteKeys("reviews:pet:*");
        }
        if (review.getAccessoryId() != null) {
            baseRedisService.deleteKeys("reviews:accessory:*");
        }
        
        return mapToResponse(updatedReview);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public void deleteReview(Long id) {
        ReviewEntity review = reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        
        UserEntity currentUser = getCurrentUser();
        
        // Chỉ admin hoặc chính người tạo đánh giá mới có thể xóa
        if (!currentUser.getRole().getName().equals("ROLE_ADMIN") && !review.getUserId().equals(currentUser.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        
        reviewRepository.delete(review);
        
        // Clear cache
        if (review.getPetId() != null) {
            baseRedisService.deleteKeys("reviews:pet:*");
        }
        if (review.getAccessoryId() != null) {
            baseRedisService.deleteKeys("reviews:accessory:*");
        }
    }

    public Pagination<ReviewResponse> getReviewsByPetId(Long petId, int page, int size) {
        String cacheKey = "reviews:pet:" + petId + ":" + page + ":" + size;
        
        Pagination<ReviewResponse> cachedResult = baseRedisService.get(cacheKey, new TypeReference<Pagination<ReviewResponse>>() {});
        if (cachedResult != null) {
            return cachedResult;
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewEntity> reviewPage = reviewRepository.findByPetId(petId, pageable);
        
        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Pagination<ReviewResponse> pagination = Pagination.<ReviewResponse>builder()
                .content(reviews)
                .page(page)
                .size(size)
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .build();

        baseRedisService.setObjectForMinutes(cacheKey, pagination, 30);
        return pagination;
    }

    public Pagination<ReviewResponse> getReviewsByAccessoryId(Long accessoryId, int page, int size) {
        String cacheKey = "reviews:accessory:" + accessoryId + ":" + page + ":" + size;
        
        Pagination<ReviewResponse> cachedResult = baseRedisService.get(cacheKey, new TypeReference<Pagination<ReviewResponse>>() {});
        if (cachedResult != null) {
            return cachedResult;
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewEntity> reviewPage = reviewRepository.findByAccessoryId(accessoryId, pageable);
        
        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Pagination<ReviewResponse> pagination = Pagination.<ReviewResponse>builder()
                .content(reviews)
                .page(page)
                .size(size)
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .build();

        baseRedisService.setObjectForMinutes(cacheKey, pagination, 30);
        return pagination;
    }

    private ReviewResponse mapToResponse(ReviewEntity review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUserId())
                .petId(review.getPetId())
                .accessoryId(review.getAccessoryId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}