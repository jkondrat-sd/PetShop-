package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductDTO {
    private Long id;
    private String name;
    private String type; // Pet/Accessory/...
    private int sold;
    private BigDecimal revenue;
}
