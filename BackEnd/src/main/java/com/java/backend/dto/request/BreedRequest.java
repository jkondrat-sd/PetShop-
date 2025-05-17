package com.java.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BreedRequest {
    private String breedName;
    private String petType;
    private String description;
    private String status;
}