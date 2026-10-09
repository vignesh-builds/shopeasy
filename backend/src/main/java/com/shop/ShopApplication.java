package com.shop;

import com.shop.model.*;
import com.shop.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ShopApplication {
    public static void main(String[] args) { SpringApplication.run(ShopApplication.class, args); }

    /** Seeds an admin user, categories and sample products on first run. */
    @Bean CommandLineRunner seed(UserRepository users, CategoryRepository cats, ProductRepository products, PasswordEncoder enc,
                                 @Value("${app.admin.email}") String adminEmail, @Value("${app.admin.password}") String adminPass) {
        return args -> {
            if (!users.existsByEmail(adminEmail)) {
                User u = new User(); u.name = "Admin"; u.email = adminEmail; u.password = enc.encode(adminPass); u.role = "ADMIN"; users.save(u);
            }
            if (cats.count() == 0) {
                Category el = cat(cats, "Electronics"), fa = cat(cats, "Fashion"), ho = cat(cats, "Home & Kitchen"), bo = cat(cats, "Books");
                String[][] d = {
                    {"Wireless Mouse", "Ergonomic 2.4GHz wireless mouse", "799", "50", "mouse", "E"},
                    {"Mechanical Keyboard", "RGB backlit, blue switches", "2999", "25", "keyboard", "E"},
                    {"Bluetooth Headphones", "Active noise cancelling, 30h battery", "4499", "15", "headphones", "E"},
                    {"USB-C Hub 7-in-1", "HDMI, USB 3.0, SD card reader", "1599", "40", "usbhub", "E"},
                    {"Smart Watch", "Heart-rate, SpO2 and sleep tracking", "3499", "30", "watch", "E"},
                    {"Cotton T-Shirt", "100% cotton, regular fit", "499", "100", "tshirt", "F"},
                    {"Denim Jacket", "Classic blue denim", "1999", "20", "jacket", "F"},
                    {"Running Shoes", "Lightweight breathable mesh", "2499", "35", "shoes", "F"},
                    {"Non-stick Pan", "28cm induction friendly", "899", "45", "pan", "H"},
                    {"Table Lamp", "Warm LED, adjustable arm", "1199", "8", "lamp", "H"},
                    {"Clean Code", "A handbook of agile software craftsmanship", "699", "60", "book1", "B"},
                    {"Atomic Habits", "Tiny changes, remarkable results", "549", "5", "book2", "B"}
                };
                for (String[] x : d) {
                    Product p = new Product(); p.name = x[0]; p.description = x[1]; p.price = Double.parseDouble(x[2]);
                    p.stock = Integer.parseInt(x[3]); p.imageUrl = "https://picsum.photos/seed/" + x[4] + "/400/300";
                    p.category = switch (x[5]) { case "E" -> el; case "F" -> fa; case "H" -> ho; default -> bo; };
                    products.save(p);
                }
            }
        };
    }
    private Category cat(CategoryRepository r, String n) { Category c = new Category(); c.name = n; return r.save(c); }
}
