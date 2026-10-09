package com.shop.service;
import com.shop.dto.Dtos.*;
import com.shop.exception.ApiException;
import com.shop.model.*;
import com.shop.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class OrderService {
    public static final Set<String> STATUSES = Set.of("PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED");
    private static final double FREE_SHIPPING_ABOVE = 1000, SHIPPING_FEE = 50;

    private final OrderRepository orders; private final ProductRepository products;
    public OrderService(OrderRepository o, ProductRepository p) { orders = o; products = p; }

    private static double round2(double v) { return Math.round(v * 100.0) / 100.0; }

    @Transactional
    public CustomerOrder place(String email, OrderReq req) {
        if (!List.of("COD", "ONLINE").contains(req.paymentMethod()))
            throw ApiException.badRequest("Unsupported payment method");

        Map<Long, Integer> qty = new LinkedHashMap<>();              // merge duplicate lines
        for (OrderLine l : req.items()) qty.merge(l.productId(), l.quantity(), Integer::sum);

        CustomerOrder o = new CustomerOrder();
        o.userEmail = email; o.paymentMethod = req.paymentMethod();
        o.shippingName = req.shippingName(); o.shippingPhone = req.shippingPhone(); o.shippingAddress = req.shippingAddress();

        for (var e : qty.entrySet()) {
            Product p = products.findByIdForUpdate(e.getKey())
                    .orElseThrow(() -> ApiException.badRequest("Product not found: " + e.getKey()));
            if (p.stock < e.getValue()) throw ApiException.badRequest("Insufficient stock for " + p.name + " (available: " + p.stock + ")");
            p.stock -= e.getValue(); products.save(p);
            OrderItem i = new OrderItem();
            i.productId = p.id; i.productName = p.name; i.imageUrl = p.imageUrl; i.price = p.price; i.quantity = e.getValue();
            o.items.add(i); o.subtotal += p.price * e.getValue();
        }
        o.subtotal = round2(o.subtotal);
        o.shippingFee = o.subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
        o.total = round2(o.subtotal + o.shippingFee);

        // MOCK payment: ONLINE is treated as paid instantly. Replace with Razorpay/Stripe verification here.
        if (req.paymentMethod().equals("ONLINE")) { o.paymentStatus = "PAID"; o.status = "PAID"; }
        return orders.save(o);
    }

    @Transactional
    public CustomerOrder cancel(String email, Long id) {
        CustomerOrder o = orders.findById(id).orElseThrow(() -> ApiException.notFound("Order not found"));
        if (!o.userEmail.equals(email)) throw new ApiException(HttpStatus.FORBIDDEN, "Not your order");
        if (!o.status.equals("PLACED") && !o.status.equals("PAID"))
            throw ApiException.badRequest("Order can no longer be cancelled");
        return doCancel(o);
    }

    @Transactional
    public CustomerOrder updateStatus(Long id, String status) {
        if (!STATUSES.contains(status)) throw ApiException.badRequest("Invalid status");
        CustomerOrder o = orders.findById(id).orElseThrow(() -> ApiException.notFound("Order not found"));
        if (o.status.equals("CANCELLED") || o.status.equals("DELIVERED"))
            throw ApiException.badRequest("Order is already " + o.status);
        if (status.equals("CANCELLED")) return doCancel(o);
        o.status = status;
        if (status.equals("DELIVERED") && o.paymentMethod.equals("COD")) o.paymentStatus = "PAID";
        return orders.save(o);
    }

    private CustomerOrder doCancel(CustomerOrder o) {
        for (OrderItem i : o.items)
            products.findByIdForUpdate(i.productId).ifPresent(p -> { p.stock += i.quantity; products.save(p); });
        o.paymentStatus = o.paymentStatus.equals("PAID") ? "REFUNDED" : "CANCELLED";
        o.status = "CANCELLED";
        return orders.save(o);
    }
}
