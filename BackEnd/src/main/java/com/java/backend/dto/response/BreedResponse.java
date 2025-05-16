package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BreedResponse {
    private Long breedId;
    private String breedName;
    private String petType;
    private String description;
    private String status;
}