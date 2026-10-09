package com.shop.repository;
import com.shop.model.CustomerOrder;
import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByUserEmailOrderByCreatedAtDesc(String email);
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();
    @Query("select coalesce(sum(o.total), 0) from CustomerOrder o where o.status <> 'CANCELLED'")
    double totalRevenue();
    @Query("select o.status, count(o) from CustomerOrder o group by o.status")
    List<Object[]> countByStatus();
}
