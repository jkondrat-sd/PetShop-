package com.java.backend.repository;

import com.java.backend.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

@Query("SELECT FUNCTION('DATE', o.orderDate) as date, SUM(o.totalAmount) as revenue FROM OrderEntity o WHERE o.orderDate BETWEEN :from AND :to GROUP BY FUNCTION('DATE', o.orderDate)")
List<Object[]> sumRevenueGroupByDate(@Param("from") LocalDate from, @Param("to") LocalDate to);

    // Top sold pets
    @Query(value = "SELECT p.id, p.name, SUM(od.quantity), SUM(od.price * od.quantity) " +
            "FROM order_details od JOIN pets p ON od.pet_id = p.id " +
            "JOIN orders o ON od.order_id = o.id " +
            "WHERE o.created_at BETWEEN :from AND :to " +
            "GROUP BY p.id, p.name " +
            "ORDER BY SUM(od.quantity) DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> topSoldPets(@Param("from") LocalDate from, @Param("to") LocalDate to, @Param("limit") int limit);

    // Top sold accessories
    @Query(value = "SELECT a.id, a.name, SUM(od.quantity), SUM(od.price * od.quantity) " +
            "FROM order_details od JOIN accessories a ON od.accessory_id = a.id " +
            "JOIN orders o ON od.order_id = o.id " +
            "WHERE o.created_at BETWEEN :from AND :to " +
            "GROUP BY a.id, a.name " +
            "ORDER BY SUM(od.quantity) DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> topSoldAccessories(@Param("from") LocalDate from, @Param("to") LocalDate to, @Param("limit") int limit);
}