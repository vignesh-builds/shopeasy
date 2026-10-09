package com.shop.model;
import jakarta.persistence.*;

@Entity
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public Long productId;
    public String productName;
    public String imageUrl;
    public double price;
    public int quantity;
}
