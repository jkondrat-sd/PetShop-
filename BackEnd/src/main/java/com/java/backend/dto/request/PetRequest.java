package com.java.backend.dto.request;

import lombok.Data;

@Data
public class PetRequest {
    private String petName;
    private String type;
    private Long breedId;
    private String gender;
    private Double unitPrice;
    private Integer age;
    private String status;
}