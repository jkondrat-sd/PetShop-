package com.java.backend.controller;

import com.java.backend.dto.response.*;
import com.java.backend.service.ReportService;
import com.java.backend.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/sales/overview")
    public ApiResponse<SalesOverviewDTO> getSalesOverview(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        return new ApiResponse<>(true, "Success", reportService.getSalesOverview(from, to));
    }

    @GetMapping("/sales/chart")
    public ApiResponse<List<SalesChartDTO>> getSalesChart(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        return new ApiResponse<>(true, "Success", reportService.getSalesChart(from, to));
    }

    @GetMapping("/sales/top-products")
    public ApiResponse<List<TopProductDTO>> getTopProducts(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        return new ApiResponse<>(true, "Success", reportService.getTopProducts(from, to));
    }

    @GetMapping("/inventory/pie")
    public ApiResponse<List<InventoryPieDTO>> getInventoryPie() {
        try {
            return new ApiResponse<>(true, "Success", reportService.getInventoryPie());
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        }
    }

    @GetMapping("/inventory/low-stock")
    public ApiResponse<List<LowStockProductDTO>> getLowStockProducts() {
        try {
            return new ApiResponse<>(true, "Success", reportService.getLowStockProducts());
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error: " + e.getMessage(), null);
        }
    }
}
