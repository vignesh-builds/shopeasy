package com.shop.controller;
import com.shop.dto.Dtos.CategoryReq;
import com.shop.exception.ApiException;
import com.shop.model.Category;
import com.shop.repository.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository repo; private final ProductRepository products;
    public CategoryController(CategoryRepository r, ProductRepository p) { repo = r; products = p; }

    @GetMapping public List<Category> all() { return repo.findAll(); }

    @PostMapping @SecurityRequirement(name = "bearerAuth")
    public Category create(@Valid @RequestBody CategoryReq r) {
        if (repo.existsByNameIgnoreCase(r.name().trim())) throw new ApiException(HttpStatus.CONFLICT, "Category already exists");
        Category c = new Category(); c.name = r.name().trim(); return repo.save(c);
    }

    @DeleteMapping("/{id}") @SecurityRequirement(name = "bearerAuth")
    public void delete(@PathVariable Long id) {
        if (products.existsByCategoryId(id)) throw ApiException.badRequest("Category has products; move or delete them first");
        repo.deleteById(id);
    }
}
