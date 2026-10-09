package com.shop;
import com.shop.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.assertEquals;

class JwtUtilTest {
    @Test void generatesAndParsesToken() {
        JwtUtil jwt = new JwtUtil();
        ReflectionTestUtils.setField(jwt, "secret", "test-secret-key-that-is-at-least-32-characters-long");
        ReflectionTestUtils.setField(jwt, "expiration", 60000L);
        var claims = jwt.parse(jwt.generate("a@b.com", "ADMIN"));
        assertEquals("a@b.com", claims.getSubject());
        assertEquals("ADMIN", claims.get("role"));
    }
}
