package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesChartDTO {
    private String date; // yyyy-MM-dd
    private BigDecimal revenue;
}
