package com.shop.repository;
import com.shop.model.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);   // prevents overselling under concurrency

    List<Product> findByStockLessThanEqualOrderByStockAsc(int stock);
    boolean existsByCategoryId(Long categoryId);
}
