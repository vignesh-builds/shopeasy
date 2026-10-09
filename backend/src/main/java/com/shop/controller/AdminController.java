package com.shop.controller;
import com.shop.dto.Dtos.StatusReq;
import com.shop.model.*;
import com.shop.repository.*;
import com.shop.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/admin") @SecurityRequirement(name = "bearerAuth")
public class AdminController {
    private final UserRepository users; private final ProductRepository products;
    private final OrderRepository orders; private final OrderService orderService;
    public AdminController(UserRepository u, ProductRepository p, OrderRepository o, OrderService s) { users = u; products = p; orders = o; orderService = s; }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (String s : List.of("PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED")) byStatus.put(s, 0L);
        for (Object[] row : orders.countByStatus()) byStatus.put((String) row[0], (Long) row[1]);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalUsers", users.count()); m.put("totalProducts", products.count());
        m.put("totalOrders", orders.count()); m.put("totalRevenue", orders.totalRevenue());
        m.put("ordersByStatus", byStatus);
        m.put("lowStock", products.findByStockLessThanEqualOrderByStockAsc(10));
        return m;
    }

    @GetMapping("/orders") public List<CustomerOrder> allOrders() { return orders.findAllByOrderByCreatedAtDesc(); }

    @PutMapping("/orders/{id}/status")
    public CustomerOrder status(@PathVariable Long id, @Valid @RequestBody StatusReq r) { return orderService.updateStatus(id, r.status()); }

    @GetMapping("/users") public List<User> allUsers() { return users.findAll(); }
}
