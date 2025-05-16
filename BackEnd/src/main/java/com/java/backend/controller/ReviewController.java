package com.java.backend.controller;

import com.java.backend.dto.request.ReviewRequest;
import com.java.backend.dto.response.ApiResponse;
import com.java.backend.dto.response.Pagination;
import com.java.backend.dto.response.ReviewResponse;
import com.java.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(@RequestBody ReviewRequest request) {
        ReviewResponse review = reviewService.addReview(request);
        return new ResponseEntity<>(new ApiResponse<>(true, "Review added successfully", review), HttpStatus.CREATED);
    }
    
    @GetMapping("/pet/{petId}")
    public ResponseEntity<ApiResponse<Pagination<ReviewResponse>>> getPetReviews(
            @PathVariable Long petId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<ReviewResponse> reviews = reviewService.getPetReviews(petId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Get pet reviews successfully", reviews));
    }
    
    @GetMapping("/accessory/{accessoryId}")
    public ResponseEntity<ApiResponse<Pagination<ReviewResponse>>> getAccessoryReviews(
            @PathVariable Long accessoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pagination<ReviewResponse> reviews = reviewService.getAccessoryReviews(accessoryId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Get accessory reviews successfully", reviews));
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delete review successfully", null));
    }
}