package com.shop.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public String name;
    @Column(length = 2000) public String description;
    public double price;
    public int stock;
    public String imageUrl;
    @ManyToOne(fetch = FetchType.EAGER) public Category category;
    public double rating;
    public int reviewCount;
    public LocalDateTime createdAt = LocalDateTime.now();
}
