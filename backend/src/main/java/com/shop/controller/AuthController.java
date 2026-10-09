package com.shop.controller;
import com.shop.dto.Dtos.*;
import com.shop.exception.ApiException;
import com.shop.model.User;
import com.shop.repository.UserRepository;
import com.shop.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder enc; private final JwtUtil jwt;
    public AuthController(UserRepository u, PasswordEncoder e, JwtUtil j) { users = u; enc = e; jwt = j; }

    @PostMapping("/register")
    public AuthRes register(@Valid @RequestBody RegisterReq r) {
        String email = r.email().trim().toLowerCase();
        if (users.existsByEmail(email)) throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        User u = new User(); u.name = r.name().trim(); u.email = email; u.password = enc.encode(r.password());
        users.save(u);
        return res(u);
    }

    @PostMapping("/login")
    public AuthRes login(@Valid @RequestBody LoginReq r) {
        User u = users.findByEmail(r.email().trim().toLowerCase()).orElse(null);
        if (u == null || !enc.matches(r.password(), u.password))
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return res(u);
    }

    private AuthRes res(User u) { return new AuthRes(jwt.generate(u.email, u.role), u.name, u.email, u.role); }
}
