package com.shop.controller;
import com.shop.dto.Dtos.*;
import com.shop.exception.ApiException;
import com.shop.model.*;
import com.shop.repository.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repo; private final CategoryRepository cats;
    private final ReviewRepository reviews; private final UserRepository users;
    public ProductController(ProductRepository r, CategoryRepository c, ReviewRepository rv, UserRepository u) {
        repo = r; cats = c; reviews = rv; users = u;
    }

    /** GET /api/products?q=&categoryId=&sort=newest|price_asc|price_desc|rating&page=0&size=8 */
    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String q, @RequestParam(required = false) Long categoryId,
                                    @RequestParam(defaultValue = "newest") String sort,
                                    @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "8") int size) {
        Specification<Product> spec = (root, cq, cb) -> {
            List<Predicate> ps = new ArrayList<>();
            if (q != null && !q.isBlank()) ps.add(cb.like(cb.lower(root.get("name")), "%" + q.trim().toLowerCase() + "%"));
            if (categoryId != null) ps.add(cb.equal(root.get("category").get("id"), categoryId));
            return cb.and(ps.toArray(new Predicate[0]));
        };
        Sort s = switch (sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            default -> Sort.by("createdAt").descending();
        };
        Page<Product> p = repo.findAll(spec, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), s));
        return Map.of("content", p.getContent(), "page", p.getNumber(), "totalPages", p.getTotalPages(), "totalElements", p.getTotalElements());
    }

    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) { return repo.findById(id).orElseThrow(() -> ApiException.notFound("Product not found")); }

    @PostMapping @SecurityRequirement(name = "bearerAuth")
    public Product create(@Valid @RequestBody ProductReq r) { return repo.save(apply(new Product(), r)); }

    @PutMapping("/{id}") @SecurityRequirement(name = "bearerAuth")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductReq r) { return repo.save(apply(one(id), r)); }

    @DeleteMapping("/{id}") @Transactional @SecurityRequirement(name = "bearerAuth")
    public void delete(@PathVariable Long id) { reviews.deleteByProductId(id); repo.deleteById(id); }

    private Product apply(Product p, ProductReq r) {
        p.name = r.name().trim(); p.description = r.description(); p.price = r.price(); p.stock = r.stock(); p.imageUrl = r.imageUrl();
        p.category = r.categoryId() == null ? null : cats.findById(r.categoryId()).orElseThrow(() -> ApiException.badRequest("Category not found"));
        return p;
    }

    // ---------- reviews ----------
    @GetMapping("/{id}/reviews")
    public List<Review> reviews(@PathVariable Long id) { return reviews.findByProductIdOrderByCreatedAtDesc(id); }

    @PostMapping("/{id}/reviews") @Transactional @SecurityRequirement(name = "bearerAuth")
    public Review addReview(@PathVariable Long id, @Valid @RequestBody ReviewReq r, Authentication auth) {
        Product p = one(id);
        if (reviews.existsByProductIdAndUserEmail(id, auth.getName())) throw new ApiException(HttpStatus.CONFLICT, "You already reviewed this product");
        User u = users.findByEmail(auth.getName()).orElseThrow(() -> ApiException.notFound("User not found"));
        Review rv = new Review(); rv.productId = id; rv.userEmail = u.email; rv.userName = u.name; rv.rating = r.rating(); rv.comment = r.comment();
        reviews.save(rv);
        Double avg = reviews.averageRating(id);
        p.rating = avg == null ? 0 : Math.round(avg * 10.0) / 10.0;
        p.reviewCount = (int) reviews.countByProductId(id);
        repo.save(p);
        return rv;
    }
}
