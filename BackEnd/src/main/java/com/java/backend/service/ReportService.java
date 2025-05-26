package com.java.backend.service;

import com.java.backend.dto.response.*;
import com.java.backend.entity.*;
import com.java.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AccessoryRepository accessoryRepository;

    // Tổng quan doanh số
    public SalesOverviewDTO getSalesOverview(String from, String to) {
        LocalDate fromDate = from != null ? LocalDate.parse(from) : LocalDate.now().minusMonths(1);
        LocalDate toDate = to != null ? LocalDate.parse(to) : LocalDate.now();

        LocalDateTime fromDateTime = fromDate.atStartOfDay();
        LocalDateTime toDateTime = toDate.plusDays(1).atStartOfDay();
        BigDecimal totalRevenue = orderRepository.sumRevenueBetween(fromDateTime, toDateTime);
        int totalOrders = orderRepository.countByOrderDateBetween(fromDate.atStartOfDay(), toDate.plusDays(1).atStartOfDay());
        int newCustomers = userRepository.countByCreatedAtBetween(fromDate.atStartOfDay(), toDate.plusDays(1).atStartOfDay());

        return new SalesOverviewDTO(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders,
                newCustomers
        );
    }

    // Biểu đồ doanh thu theo ngày
    public List<SalesChartDTO> getSalesChart(String from, String to) {
        LocalDate fromDate = from != null ? LocalDate.parse(from) : LocalDate.now().minusMonths(1);
        LocalDate toDate = to != null ? LocalDate.parse(to) : LocalDate.now();

        List<Object[]> rows = orderRepository.sumRevenueGroupByDate(fromDate, toDate);
        List<SalesChartDTO> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(new SalesChartDTO(
                    row[0].toString(), // date
                    (BigDecimal) row[1] // revenue
            ));
        }
        return result;
    }

    // Top sản phẩm bán chạy
    public List<TopProductDTO> getTopProducts(String from, String to) {
        LocalDate fromDate = from != null ? LocalDate.parse(from) : LocalDate.now().minusMonths(1);
        LocalDate toDate = to != null ? LocalDate.parse(to) : LocalDate.now();

        List<Object[]> petRows = orderRepository.topSoldPets(fromDate, toDate, 5);
        List<Object[]> accRows = orderRepository.topSoldAccessories(fromDate, toDate, 5);

        List<TopProductDTO> result = new ArrayList<>();
        for (Object[] row : petRows) {
            result.add(new TopProductDTO(
                    ((Number) row[0]).longValue(), // id
                    (String) row[1], // name
                    "Pet",
                    ((Number) row[2]).intValue(), // sold
                    (BigDecimal) row[3] // revenue
            ));
        }
        for (Object[] row : accRows) {
            result.add(new TopProductDTO(
                    ((Number) row[0]).longValue(),
                    (String) row[1],
                    "Accessory",
                    ((Number) row[2]).intValue(),
                    (BigDecimal) row[3]
            ));
        }
        return result.stream().sorted(Comparator.comparing(TopProductDTO::getSold).reversed()).limit(5).collect(Collectors.toList());
    }

    // Pie chart tồn kho
    public List<InventoryPieDTO> getInventoryPie() {
        try {
            System.out.println("Getting inventory pie data...");
            int petStock = petRepository.sumStock();
            int accStock = accessoryRepository.sumStock();
            System.out.println("Pet stock: " + petStock + ", Accessory stock: " + accStock);
            
            List<InventoryPieDTO> result = new ArrayList<>();
            result.add(new InventoryPieDTO("Pet", petStock));
            result.add(new InventoryPieDTO("Accessory", accStock));
            System.out.println("Inventory pie result: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("Error in getInventoryPie: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error getting inventory pie data: " + e.getMessage());
        }
    }

    // Sản phẩm sắp hết hàng
    public List<LowStockProductDTO> getLowStockProducts() {
        try {
            System.out.println("Getting low stock products...");
            List<LowStockProductDTO> result = new ArrayList<>();
            
            // Kiểm tra null trước khi stream
            List<PetEntity> pets = petRepository.findAll();
            System.out.println("Found " + (pets != null ? pets.size() : 0) + " pets");
            
            if (pets != null) {
                pets.stream()
                    .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() <= 5)
                    .forEach(p -> {
                        System.out.println("Processing pet: " + p.getPetName() + ", stock: " + p.getStockQuantity());
                        result.add(new LowStockProductDTO(
                            p.getPetId(),
                            p.getPetName(),
                            "Pet",
                            p.getStockQuantity(),
                            p.getStockQuantity() == 0 ? "Out" : "Low"
                        ));
                    });
            }

            List<AccessoryEntity> accessories = accessoryRepository.findAll();
            System.out.println("Found " + (accessories != null ? accessories.size() : 0) + " accessories");
            
            if (accessories != null) {
                accessories.stream()
                    .filter(a -> a.getStockQuantity() != null && a.getStockQuantity() <= 5)
                    .forEach(a -> {
                        System.out.println("Processing accessory: " + a.getAccessoryName() + ", stock: " + a.getStockQuantity());
                        result.add(new LowStockProductDTO(
                            a.getAccessoryId(),
                            a.getAccessoryName(),
                            "Accessory",
                            a.getStockQuantity(),
                            a.getStockQuantity() == 0 ? "Out" : "Low"
                        ));
                    });
            }
            
            System.out.println("Low stock products result: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("Error in getLowStockProducts: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error getting low stock products: " + e.getMessage());
        }
    }

    public List<UserEntity> getLatestUsers() {
        return userRepository.findTop5ByOrderByCreatedAtDesc();
    }
}
