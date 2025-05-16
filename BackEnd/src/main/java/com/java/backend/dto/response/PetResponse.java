package com.java.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class PetResponse {
    private Long petId;
    private String petName;
    private String type;
    private String breed;
    private Long breedId;
    private String gender;
    private Double unitPrice;
    private Integer age;
    private String status;
    private String thumbnail;
    private List<String> images;
    private Date createdAt;
    private Date updatedAt;
}