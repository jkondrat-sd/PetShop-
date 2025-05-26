package com.java.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOverviewDTO {
    private BigDecimal totalRevenue;
    private int totalOrders;
    private int newCustomers;
}
