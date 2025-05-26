package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LowStockProductDTO {
    private Long id;
    private String name;
    private String type;
    private int stock;
    private String status; // "Low", "Out", "Normal"
}
