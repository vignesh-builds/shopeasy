package com.shop.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public final class Dtos {
    private Dtos() {}
    public record RegisterReq(@NotBlank String name, @NotBlank @Email String email,
                              @Size(min = 6, message = "Password must be at least 6 characters") String password) {}
    public record LoginReq(@NotBlank String email, @NotBlank String password) {}
    public record AuthRes(String token, String name, String email, String role) {}
    public record ProfileReq(@NotBlank String name) {}
    public record PasswordReq(@NotBlank String currentPassword,
                              @Size(min = 6, message = "New password must be at least 6 characters") String newPassword) {}
    public record CategoryReq(@NotBlank String name) {}
    public record ProductReq(@NotBlank String name, String description, @Positive double price,
                             @Min(0) int stock, String imageUrl, Long categoryId) {}
    public record ReviewReq(@Min(1) @Max(5) int rating, @Size(max = 1000) String comment) {}
    public record OrderLine(@NotNull Long productId, @Min(1) int quantity) {}
    public record OrderReq(@Valid @NotEmpty List<OrderLine> items,
                           @NotBlank String shippingName, @NotBlank String shippingPhone,
                           @NotBlank @Size(min = 10, message = "Address is too short") String shippingAddress,
                           @NotBlank String paymentMethod) {}
    public record StatusReq(@NotBlank String status) {}
}
