package com.shop.controller;
import com.shop.dto.Dtos.*;
import com.shop.exception.ApiException;
import com.shop.model.User;
import com.shop.repository.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/users/me") @SecurityRequirement(name = "bearerAuth")
public class UserController {
    private final UserRepository users; private final PasswordEncoder enc;
    public UserController(UserRepository u, PasswordEncoder e) { users = u; enc = e; }

    private User current(Authentication a) { return users.findByEmail(a.getName()).orElseThrow(() -> ApiException.notFound("User not found")); }

    @GetMapping public User me(Authentication a) { return current(a); }

    @PutMapping public User update(@Valid @RequestBody ProfileReq r, Authentication a) {
        User u = current(a); u.name = r.name().trim(); return users.save(u);
    }

    @PutMapping("/password")
    public Map<String, String> password(@Valid @RequestBody PasswordReq r, Authentication a) {
        User u = current(a);
        if (!enc.matches(r.currentPassword(), u.password)) throw ApiException.badRequest("Current password is incorrect");
        u.password = enc.encode(r.newPassword()); users.save(u);
        return Map.of("message", "Password updated");
    }
}
