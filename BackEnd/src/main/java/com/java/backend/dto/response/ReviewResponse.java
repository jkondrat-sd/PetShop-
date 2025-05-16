package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class ReviewResponse {
    private Long reviewId;
    private String username;
    private String userAvatar;
    private Integer rating;
    private String comment;
    private Long petId;
    private Long accessoryId;
    private Date createdAt;
}