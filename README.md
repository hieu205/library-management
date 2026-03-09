# Library Management System — Backend API

A RESTful backend for a library management system, built with **Spring Boot**. Covers full CRUD for books, authors, categories, inventory tracking, and a complete borrow/return workflow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 4.0.3 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security (HTTP Basic + BCrypt) |
| Database | MySQL |
| Validation | Jakarta Bean Validation (`@Valid`) |
| Utilities | Lombok |

---

## Project Structure

```
src/main/java/com/example/demo/
├── config/          # Security configuration
├── controller/      # REST controllers (6 modules)
├── dto/
│   ├── request/     # Input DTOs with validation
│   └── response/    # Output DTOs + ApiResponse<T> wrapper
├── entity/          # JPA entities (11 tables)
├── handleException/ # Global exception handler
├── repository/      # Spring Data JPA repositories
└── service/         # Business logic layer
```

---

## Database Schema

```
Role ←── User ──→ BorrowRecord ──→ BorrowItem ──→ Book
                                                    │
                                            InventoryLog
                                            Inventory (1-1)
                                            BookAuthor  ──→ Author
                                            BookCategory──→ Category
```

**Tables:** `roles`, `users`, `books`, `authors`, `book_authors`, `categories`, `book_categories`, `inventory`, `inventory_logs`, `borrow_records`, `borrow_items`

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth / Users — `/api/v1/users`

| Method | Path | Description |
|---|---|---|
| `POST` | `/users/register` | Register new account |
| `POST` | `/users/login` | Login |
| `GET` | `/users/me` | Get own profile |
| `PUT` | `/users/me` | Update own profile |
| `GET` | `/users/me/borrow-history` | Own borrow history (paged) |
| `GET` | `/users/me/current-borrows` | Currently borrowed books (paged) |
| `POST` | `/users` | Admin: create user |
| `PUT` | `/users/{id}` | Admin: update user |
| `PATCH` | `/users/{id}/status` | Admin: activate / deactivate user |
| `GET` | `/users` | Admin: list all users |
| `GET` | `/users/{userId}/borrow-history` | Admin: view any user's borrow history |

### Books — `/api/v1/books`

| Method | Path | Description |
|---|---|---|
| `POST` | `/books` | Create book |
| `GET` | `/books` | List all books |
| `GET` | `/books/{id}` | Get book detail |
| `PUT` | `/books/{id}` | Update book |
| `DELETE` | `/books/{id}` | Delete book |
| `POST` | `/books/{id}/authors` | Assign authors to book |
| `GET` | `/books/search?keyword=` | Search by title / author / category |

### Authors — `/api/v1/authors`

| Method | Path | Description |
|---|---|---|
| `POST` | `/authors` | Create author |
| `GET` | `/authors` | List all authors |
| `GET` | `/authors/{id}` | Get author |
| `PUT` | `/authors/{id}` | Update author |
| `DELETE` | `/authors/{id}` | Delete author |

### Categories — `/api/v1/categories`

| Method | Path | Description |
|---|---|---|
| `POST` | `/categories` | Create category |
| `GET` | `/categories` | List all categories |
| `GET` | `/categories/{id}` | Get category |
| `PUT` | `/categories/{id}` | Update category |
| `DELETE` | `/categories/{id}` | Delete category |

### Inventory — `/api/v1/inventory`

| Method | Path | Description |
|---|---|---|
| `POST` | `/inventory/add` | Import stock for a book |
| `PATCH` | `/inventory/decrease` | Decrease available stock |
| `PATCH` | `/inventory/increase` | Increase available stock |
| `GET` | `/inventory` | List all inventory |
| `GET` | `/inventory/{bookId}` | Get inventory for a book |
| `GET` | `/inventory/logs` | All stock change logs |
| `GET` | `/inventory/logs/{bookId}` | Stock change logs for a book |

### Borrow & Return — `/api/v1/borrow`

| Method | Path | Description |
|---|---|---|
| `POST` | `/borrow` | Create borrow record (multiple books in one request) |
| `POST` | `/borrow/{borrowId}/return` | Return books (supports partial return) |
| `GET` | `/borrow` | List all borrow records (paged) |
| `GET` | `/borrow/{id}` | Get borrow record detail |

---

## Key Business Logic

### Borrow Flow
1. Validate all books exist and have sufficient `available_quantity` **before** any write
2. Create `borrow_record` (status: `BORROWING`)
3. Create `borrow_item` per book with `returned_quantity = 0`
4. Decrease `inventory.available_quantity` per book
5. Write `inventory_log` with `change_type = BORROW`
6. Full rollback via `@Transactional` if any step fails

### Return Flow (supports partial return)
1. Reject if record is already `RETURNED`
2. Validate each book belongs to the record and `returnQuantity ≤ remaining`
3. Update `borrow_item.returned_quantity`
4. Increase `inventory.available_quantity`
5. Write `inventory_log` with `change_type = RETURN`
6. If all items fully returned → set record status to `RETURNED`

### Inventory Logging
Every stock change (import, borrow, return) writes an `inventory_log` entry capturing `change_type`, `quantity_changed`, `total_after`, and `available_after` — providing a full audit trail.

---

## Response Format

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

Validation errors return `400` with field-level detail:

```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Validation failed",
  "details": {
    "name": "Tên không được để trống"
  }
}
```

---

## Getting Started

### Prerequisites
- Java 17+
- MySQL 8+
- Maven 3.8+

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/library-management.git
   cd library-management/demo
   ```

2. **Create the database**
   ```sql
   CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   Then import the schema:
   ```bash
   mysql -u root -p library_db < database.sql
   ```

3. **Configure credentials**

   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/library_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   The server starts on `http://localhost:8080`.

---

## Authentication

The API uses **HTTP Basic Authentication**. Include credentials in the `Authorization` header:

```
Authorization: Basic base64(username:password)
```

Public endpoints (no auth required):
- `POST /api/v1/users/register`
- `POST /api/v1/users/login`

---

## Postman Collection

Import `LibraryManagement.postman_collection.json` from the root of the repository to get all pre-built requests.

---

## Roadmap

- [ ] JWT authentication (replace HTTP Basic)
- [ ] Role-based access control (`ADMIN` / `LIBRARIAN` / `MEMBER`)
- [ ] Overdue detection endpoint (`GET /api/v1/borrow/overdue`)
- [ ] Reporting endpoints (top books, top users, borrowing stats)
- [ ] Swagger / OpenAPI documentation
- [ ] Unit & integration tests
