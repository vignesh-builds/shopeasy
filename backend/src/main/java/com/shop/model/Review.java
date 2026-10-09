package com.shop.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public Long productId;
    public String userName;
    @JsonIgnore public String userEmail;
    public int rating;
    @Column(length = 1000) public String comment;
    public LocalDateTime createdAt = LocalDateTime.now();
}
