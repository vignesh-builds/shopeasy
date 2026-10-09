package com.shop.controller;
import com.shop.dto.Dtos.OrderReq;
import com.shop.model.CustomerOrder;
import com.shop.repository.OrderRepository;
import com.shop.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/orders") @SecurityRequirement(name = "bearerAuth")
public class OrderController {
    private final OrderService service; private final OrderRepository repo;
    public OrderController(OrderService s, OrderRepository r) { service = s; repo = r; }

    @PostMapping public CustomerOrder place(@Valid @RequestBody OrderReq req, Authentication a) { return service.place(a.getName(), req); }
    @GetMapping public List<CustomerOrder> mine(Authentication a) { return repo.findByUserEmailOrderByCreatedAtDesc(a.getName()); }
    @PutMapping("/{id}/cancel") public CustomerOrder cancel(@PathVariable Long id, Authentication a) { return service.cancel(a.getName(), id); }
}
