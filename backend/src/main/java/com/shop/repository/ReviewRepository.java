package com.shop.repository;
import com.shop.model.Review;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    boolean existsByProductIdAndUserEmail(Long productId, String userEmail);
    long countByProductId(Long productId);
    void deleteByProductId(Long productId);
    @Query("select avg(r.rating) from Review r where r.productId = :pid")
    Double averageRating(@Param("pid") Long pid);
}
