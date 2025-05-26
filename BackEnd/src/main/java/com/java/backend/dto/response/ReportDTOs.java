// package com.java.backend.dto.response;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.math.BigDecimal;

// @Data @NoArgsConstructor @AllArgsConstructor
// public class SalesOverviewDTO {
//     private BigDecimal totalRevenue;
//     private int totalOrders;
//     private int newCustomers;
// }

// @Data @NoArgsConstructor @AllArgsConstructor
// public class SalesChartDTO {
//     private String date; // yyyy-MM-dd
//     private BigDecimal revenue;
// }

// @Data @NoArgsConstructor @AllArgsConstructor
// public class TopProductDTO {
//     private Long id;
//     private String name;
//     private String type; // Pet/Accessory/...
//     private int sold;
//     private BigDecimal revenue;
// }

// @Data @NoArgsConstructor @AllArgsConstructor
// public class InventoryPieDTO {
//     private String type; // Pet/Accessory/...
//     private int value;   // Số lượng tồn kho
// }

// @Data @NoArgsConstructor @AllArgsConstructor
// public class LowStockProductDTO {
//     private Long id;
//     private String name;
//     private String type;
//     private int stock;
//     private String status; // "Low", "Out", "Normal"
// }
