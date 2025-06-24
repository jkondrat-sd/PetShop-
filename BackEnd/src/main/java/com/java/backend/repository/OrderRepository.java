package com.java.backend.repository;

import com.java.backend.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findByUser_UserId(Long userId, Pageable pageable);
    Page<OrderEntity> findByStatus(String status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderEntity o WHERE o.orderDate BETWEEN :from AND :to")
BigDecimal sumRevenueBetween(@Param("from") java.time.LocalDateTime from, @Param("to") java.time.LocalDateTime to);

int countByOrderDateBetween(LocalDateTime from, LocalDateTime to);

@Query(value = "SELECT DATE(o.order_date) as date, SUM(o.total_amount) as revenue " +
        "FROM orders o " +
        "WHERE o.order_date BETWEEN :from AND :to " +
        "GROUP BY DATE(o.order_date)", nativeQuery = true)
List<Object[]> sumRevenueGroupByDate(@Param("from") java.sql.Timestamp from, @Param("to") java.sql.Timestamp to);

    // Top sold pets
    @Query(value = "SELECT p.pet_id, p.pet_name, SUM(od.quantity), SUM(od.unit_price * od.quantity) " +
            "FROM order_details od " +
            "JOIN pets p ON od.pet_id = p.pet_id " +
            "JOIN orders o ON od.order_id = o.order_id " +
            "WHERE o.order_date BETWEEN :from AND :to " +
            "GROUP BY p.pet_id, p.pet_name " +
            "ORDER BY SUM(od.quantity) DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> topSoldPets(@Param("from") java.sql.Timestamp from, @Param("to") java.sql.Timestamp to, @Param("limit") int limit);

    // Top sold accessories
    @Query(value = "SELECT a.accessories_id, a.accessory_name, SUM(od.quantity), SUM(od.unit_price * od.quantity) " +
            "FROM order_details od " +
            "JOIN accessories a ON od.accessory_id = a.accessories_id " +
            "JOIN orders o ON od.order_id = o.order_id " +
            "WHERE o.order_date BETWEEN :from AND :to " +
            "GROUP BY a.accessories_id, a.accessory_name " +
            "ORDER BY SUM(od.quantity) DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> topSoldAccessories(@Param("from") java.sql.Timestamp from, @Param("to") java.sql.Timestamp to, @Param("limit") int limit);
}