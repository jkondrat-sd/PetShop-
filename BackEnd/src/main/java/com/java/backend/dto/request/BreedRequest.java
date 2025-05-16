
package com.java.backend.dto.request;

import lombok.Data;

@Data
public class BreedRequest {
    private String breedName;
    private String petType;
    private String description;
}