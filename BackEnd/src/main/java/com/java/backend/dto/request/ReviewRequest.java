package com.java.backend.dto.request;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long petId;
    private Long accessoryId;
    private Integer rating;
    private String comment;
}