# ShopEasy - Full-Stack E-Commerce Application

**Stack:** Java 17, Spring Boot 3, Spring Security + JWT, Spring Data JPA, PostgreSQL, Maven, React 18 (Vite), Docker

## Features
**Customer:** register/login (JWT), product search + category filter + sorting + pagination, product details & reviews/ratings,
cart (persisted), checkout with shipping address, COD or demo online payment, order history, cancel order (stock restored), profile & change password.

**Admin:** dashboard (revenue, orders, users, low-stock alerts), product CRUD, category management,
order management (update status: PLACED > PAID > SHIPPED > DELIVERED / CANCELLED), user list.

**Engineering:** BCrypt password hashing, role-based authorization, DTO validation, global exception handler,
pessimistic locking on stock (no overselling), Swagger UI, health endpoint, env-based config, Docker Compose, unit test.

## Quick start with Docker (easiest)
    docker compose up --build
- App: http://localhost:3000
- API: http://localhost:8080  |  Swagger: http://localhost:8080/swagger-ui.html

## Run manually
1. PostgreSQL: `CREATE DATABASE ecommerce;` (credentials in backend/src/main/resources/application.properties or DB_URL/DB_USER/DB_PASSWORD env vars)
2. Backend: `cd backend && mvn spring-boot:run`  (http://localhost:8080)
3. Frontend: `cd frontend && npm install && npm run dev`  (http://localhost:5173)

## Default admin (seeded on first start)
`admin@shop.com` / `admin123`  (change via ADMIN_EMAIL / ADMIN_PASSWORD env vars; change before any real deployment)

## Environment variables (backend)
DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET (32+ chars), JWT_EXPIRATION (ms), CORS_ORIGINS (comma separated), ADMIN_EMAIL, ADMIN_PASSWORD
Frontend: VITE_API_URL

## API summary
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/products?q=&categoryId=&sort=&page=&size= | public |
| GET | /api/products/{id}, /api/products/{id}/reviews, /api/categories | public |
| POST | /api/products/{id}/reviews | user |
| POST/PUT/DELETE | /api/products, /api/categories | admin |
| POST/GET | /api/orders | user |
| PUT | /api/orders/{id}/cancel | owner |
| GET/PUT | /api/users/me, /api/users/me/password | user |
| GET | /api/admin/stats, /api/admin/orders, /api/admin/users | admin |
| PUT | /api/admin/orders/{id}/status | admin |

## Project structure
    backend/src/main/java/com/shop/{config,security,model,repository,service,controller,dto,exception}
    frontend/src/{context,components,pages,admin}

## Going to production (next steps)
- Replace the demo payment in `OrderService.place` with Razorpay/Stripe (create order, verify signature/webhook)
- Use Flyway instead of `ddl-auto=update`, store JWT in httpOnly cookie, add rate limiting, HTTPS, image upload (S3)
