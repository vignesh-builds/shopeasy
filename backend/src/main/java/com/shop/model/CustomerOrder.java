package com.shop.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity @Table(name = "orders")
public class CustomerOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public String userEmail;
    public double subtotal;
    public double shippingFee;
    public double total;
    public String status = "PLACED";            // PLACED, PAID, SHIPPED, DELIVERED, CANCELLED
    public String paymentMethod;                // COD, ONLINE
    public String paymentStatus = "PENDING";    // PENDING, PAID, REFUNDED, CANCELLED
    public String shippingName;
    public String shippingPhone;
    @Column(length = 500) public String shippingAddress;
    public LocalDateTime createdAt = LocalDateTime.now();
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER) @JoinColumn(name = "order_id")
    public List<OrderItem> items = new ArrayList<>();
}
